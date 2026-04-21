import { Router } from 'express';
import { query } from '../config/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Raridades e probabilidades das cápsulas
const CAPSULES = {
  basic: { cost: 500, currency: 'gold', rates: { Comum: 0.85, Raro: 0.14, Épico: 0.01, Divino: 0 } },
  advanced: { cost: 150, currency: 'essence', rates: { Comum: 0, Raro: 0.70, Épico: 0.25, Divino: 0.05 } },
  mythic: { cost: 450, currency: 'essence', rates: { Comum: 0, Raro: 0, Épico: 0.80, Divino: 0.20 } },
  divine: { cost: 900, currency: 'essence', rates: { Comum: 0, Raro: 0, Épico: 0, Divino: 1.0 } }
};

// @route   GET /api/store/balance
router.get('/balance', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await query('SELECT gold, essence FROM user_balances WHERE user_id = $1', [req.user?.id]);
    res.json(result.rows[0] || { gold: 0, essence: 0 });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar saldo.' });
  }
});

// @route   GET /api/store/skins (CATALOGO COMPLETO)
router.get('/skins', async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, c.name as champion_name 
       FROM skins s 
       JOIN champions c ON s.champion_id = c.id 
       ORDER BY s.rarity DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar catálogo.' });
  }
});

// @route   GET /api/store/my-skins
router.get('/my-skins', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `SELECT us.*, s.name, s.rarity, s.damage_bonus, c.name as champion_name, s.image_url 
       FROM user_skins us 
       JOIN skins s ON us.skin_id = s.id 
       JOIN champions c ON s.champion_id = c.id
       WHERE us.user_id = $1`, 
      [req.user?.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar inventário de skins.' });
  }
});

// @route   POST /api/store/buy-capsule
router.post('/buy-capsule', authMiddleware, async (req: AuthRequest, res) => {
  const { type } = req.body; // basic, advanced, mythic, divine
  const capsule = CAPSULES[type as keyof typeof CAPSULES];

  if (!capsule) return res.status(400).json({ error: 'Cápsula inválida.' });

  try {
    // 1. Verificar Saldo
    const balanceRes = await query('SELECT gold, essence FROM user_balances WHERE user_id = $1', [req.user?.id]);
    const balance = balanceRes.rows[0];

    if (capsule.currency === 'gold' && balance.gold < capsule.cost) {
      return res.status(400).json({ error: 'Ouro insuficiente.' });
    }
    if (capsule.currency === 'essence' && balance.essence < capsule.cost) {
      return res.status(400).json({ error: 'Essência insuficiente.' });
    }

    // 2. Sortear Raridade
    const draw = Math.random();
    let selectedRarity = 'Comum';
    let cumulative = 0;
    for (const [rarity, rate] of Object.entries(capsule.rates)) {
      cumulative += rate;
      if (draw <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }

    // 3. Selecionar Skin Aleatória dessa Raridade
    const skinsPool = await query('SELECT * FROM skins WHERE rarity = $1', [selectedRarity]);
    if (skinsPool.rows.length === 0) {
      return res.status(500).json({ error: 'Nenhuma skin disponível nesta raridade.' });
    }
    const selectedSkin = skinsPool.rows[Math.floor(Math.random() * skinsPool.rows.length)];

    // 4. Transação: Debitar Saldo e Adicionar Skin
    await query('BEGIN');
    
    const debitField = capsule.currency;
    await query(`UPDATE user_balances SET ${debitField} = ${debitField} - $1 WHERE user_id = $2`, [capsule.cost, req.user?.id]);
    
    await query(
      `INSERT INTO user_skins (user_id, skin_id, count) 
       VALUES ($1, $2, 1) 
       ON CONFLICT (user_id, skin_id) DO UPDATE SET count = user_skins.count + 1`,
      [req.user?.id, selectedSkin.id]
    );

    await query('COMMIT');

    res.json({ skin: selectedSkin, message: `Você obteve: ${selectedSkin.name} (${selectedSkin.rarity})!` });
  } catch (err) {
    await query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar compra.' });
  }
});

// @route   POST /api/store/add-essence (SIMULADOR DE COMPRA)
router.post('/add-essence', authMiddleware, async (req: AuthRequest, res) => {
  const { amount } = req.body;
  try {
    await query('UPDATE user_balances SET essence = essence + $1 WHERE user_id = $2', [amount, req.user?.id]);
    res.json({ message: `${amount} Essências Celestiais adicionadas com sucesso!` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar essência.' });
  }
});

// @route   POST /api/store/reroll
router.post('/reroll', authMiddleware, async (req: AuthRequest, res) => {
  const { skinIds } = req.body; // Array com exatamente 3 IDs de skins

  if (!Array.isArray(skinIds) || skinIds.length !== 3) {
    return res.status(400).json({ error: 'Selecione exatamente 3 skins para o reroll.' });
  }

  try {
    await query('BEGIN');

    // 1. Verificar se o usuário possui todas as skins selecionadas e coletar raridades
    const invRes = await query(
      'SELECT us.skin_id, s.rarity, s.champion_id FROM user_skins us JOIN skins s ON us.skin_id = s.id WHERE us.user_id = $1 AND us.skin_id = ANY($2)',
      [req.user?.id, skinIds]
    );

    if (invRes.rows.length < 1) { 
       await query('ROLLBACK');
       return res.status(400).json({ error: 'Skins não encontradas no inventário.' });
    }

    // Identificar se todas as skins são do mesmo campeão
    const champIds = Array.from(new Set(invRes.rows.map(r => r.champion_id)));
    const sameChampionId = champIds.length === 1 ? champIds[0] : null;

    // Calcular raridade baseada nos ingredientes
    const rarities = invRes.rows.map(r => r.rarity);
    const weightMap: Record<string, number> = { 'Comum': 1, 'Raro': 2, 'Épico': 3, 'Divino': 4 };
    const maxRarityValue = Math.max(...rarities.map(r => weightMap[r]));
    
    // Chance de subir de nível (aumentada se for o mesmo campeão)
    const bonusChance = sameChampionId ? 0.5 : 0.8; // Se mesmo champ, chance de subir é maior (1.0 - 0.5 = 50% vs 20%)
    const draw = Math.random();
    let targetRarityValue = maxRarityValue;
    if (draw > bonusChance && maxRarityValue < 4) {
      targetRarityValue += 1;
    }

    const rarityNames = ['Comum', 'Raro', 'Épico', 'Divino'];
    const targetRarity = rarityNames[targetRarityValue - 1];

    // 3. Sortear nova skin da raridade alvo (favorecendo o mesmo campeão se houver bônus)
    let poolQuery = 'SELECT * FROM skins WHERE rarity = $1';
    let queryParams = [targetRarity];
    
    if (sameChampionId) {
      const samePool = await query('SELECT * FROM skins WHERE rarity = $1 AND champion_id = $2', [targetRarity, sameChampionId]);
      if (samePool.rows.length > 0) {
        // 70% de chance de vir o mesmo campeão se ele tiver skin na raridade alvo
        if (Math.random() < 0.7) {
          const selectedSkin = samePool.rows[Math.floor(Math.random() * samePool.rows.length)];
          return finalizeReroll(req, res, skinIds, selectedSkin);
        }
      }
    }

    const pool = await query('SELECT * FROM skins WHERE rarity = $1', [targetRarity]);
    const selectedSkin = pool.rows[Math.floor(Math.random() * pool.rows.length)];
    return finalizeReroll(req, res, skinIds, selectedSkin);

  } catch (err) {
    await query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro no processo de Reroll.' });
  }
});

async function finalizeReroll(req: AuthRequest, res: any, skinIds: string[], selectedSkin: any) {
    // 2. Consumir as skins
    for (const sid of skinIds) {
       await query('UPDATE user_skins SET count = count - 1 WHERE user_id = $1 AND skin_id = $2', [req.user?.id, sid]);
    }
    
    await query('DELETE FROM user_skins WHERE user_id = $1 AND count <= 0', [req.user?.id]);

    // 4. Adicionar nova skin
    await query(
      `INSERT INTO user_skins (user_id, skin_id, count) 
       VALUES ($1, $2, 1) 
       ON CONFLICT (user_id, skin_id) DO UPDATE SET count = user_skins.count + 1`,
      [req.user?.id, selectedSkin.id]
    );

    await query('COMMIT');
    res.json({ skin: selectedSkin, message: `Fusão concluída! Você recebeu: ${selectedSkin.name}` });
}

// @route   POST /api/store/equip-skin
router.post('/equip-skin', authMiddleware, async (req: AuthRequest, res) => {
  const { skinId } = req.body;

  try {
    // 1. Pegar o champion_id desta skin
    const skinInfo = await query('SELECT champion_id FROM skins WHERE id = $1', [skinId]);
    if (skinInfo.rows.length === 0) return res.status(404).json({ error: 'Skin não encontrada.' });
    const champId = skinInfo.rows[0].champion_id;

    await query('BEGIN');

    // 2. Desequipar todas as skins DESTE campeão para este usuário
    await query(
      `UPDATE user_skins 
       SET is_equipped = false 
       WHERE user_id = $1 AND skin_id IN (SELECT id FROM skins WHERE champion_id = $2)`,
      [req.user?.id, champId]
    );

    // 3. Equipar a skin selecionada
    await query(
      'UPDATE user_skins SET is_equipped = true WHERE user_id = $1 AND skin_id = $2',
      [req.user?.id, skinId]
    );

    await query('COMMIT');
    res.json({ message: 'Skin equipada com sucesso!' });
  } catch (err) {
    await query('ROLLBACK');
    res.status(500).json({ error: 'Erro ao equipar skin.' });
  }
});

export default router;
