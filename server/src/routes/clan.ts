import { Router } from 'express';
import { query } from '../config/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// @route   POST /api/clans/create
// @desc    Create a new clan
router.post('/create', authMiddleware, async (req: AuthRequest, res) => {
  const { name, tag, description, motto } = req.body;
  const userId = req.user?.id;

  if (!name || !tag || tag.length < 3 || tag.length > 4) {
    return res.status(400).json({ error: 'Dados inválidos. A TAG deve ter 3-4 caracteres.' });
  }

  try {
    // 1. Check if user already has a clan
    const inClan = await query('SELECT id FROM clan_members WHERE user_id = $1', [userId]);
    if (inClan.rows.length > 0) {
      return res.status(400).json({ error: 'Você já faz parte de um Sindicato.' });
    }

    // 2. Check if name or tag is taken
    const exists = await query('SELECT id FROM clans WHERE name = $1 OR tag = $2', [name, tag]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Nome ou TAG já estão em uso por outro clã.' });
    }

    // 3. Check balance (1000 Gold)
    const balanceRes = await query('SELECT gold FROM user_balances WHERE user_id = $1', [userId]);
    const currentGold = balanceRes.rows[0]?.gold || 0;
    if (currentGold < 1000) {
      return res.status(403).json({ error: 'Saldo de Ouro insuficiente (1.000 necessários).' });
    }

    // 4. Create Clan and deduct Gold
    await query('UPDATE user_balances SET gold = gold - 1000 WHERE user_id = $1', [userId]);
    
    const clanRes = await query(
      'INSERT INTO clans (name, tag, description, motto, leader_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, tag.toUpperCase(), description, motto, userId]
    );
    const clanId = clanRes.rows[0].id;

    // 5. Add Leader to clan_members
    await query(
      'INSERT INTO clan_members (clan_id, user_id, role) VALUES ($1, $2, $3)',
      [clanId, userId, 'LIDER']
    );

    res.json({ message: 'Sindicato fundado com sucesso!', clanId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fundar sindicato.' });
  }
});

// @route   GET /api/clans/my-clan
// @desc    Get current user's clan info
router.get('/my-clan', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const memberRes = await query(
      `SELECT cm.role, c.* FROM clan_members cm 
       JOIN clans c ON c.id = cm.clan_id 
       WHERE cm.user_id = $1`, 
      [userId]
    );

    if (memberRes.rows.length === 0) {
      return res.json({ inClan: false });
    }

    const clan = memberRes.rows[0];

    // Get all members
    const membersRes = await query(
      `SELECT u.nickname, u.mmr, u.rank, cm.role, cm.joined_at 
       FROM clan_members cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.clan_id = $1
       ORDER BY cm.role DESC, u.mmr DESC`, 
      [clan.id]
    );

    res.json({
      inClan: true,
      clan,
      members: membersRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do sindicato.' });
  }
});

// @route   GET /api/clans/search
router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    let sql = `
      SELECT c.*, COUNT(cm.id) as member_count 
      FROM clans c
      LEFT JOIN clan_members cm ON cm.clan_id = c.id
      WHERE c.name ILIKE $1 OR c.tag ILIKE $1
      GROUP BY c.id
      LIMIT 20
    `;
    const result = await query(sql, [`%${q || ''}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro na busca de sindicatos.' });
  }
});

// @route   POST /api/clans/join
router.post('/join', authMiddleware, async (req: AuthRequest, res) => {
  const { clanId } = req.body;
  const userId = req.user?.id;

  try {
    const inClan = await query('SELECT id FROM clan_members WHERE user_id = $1', [userId]);
    if (inClan.rows.length > 0) return res.status(400).json({ error: 'Você já faz parte de um clã.' });

    const clanRes = await query('SELECT max_members, (SELECT COUNT(*) FROM clan_members WHERE clan_id = $1) as current FROM clans WHERE id = $1', [clanId]);
    const { max_members, current } = clanRes.rows[0];

    if (parseInt(current) >= max_members) {
      return res.status(400).json({ error: 'Este sindicato atingiu a capacidade máxima.' });
    }

    await query('INSERT INTO clan_members (clan_id, user_id, role) VALUES ($1, $2, $3)', [clanId, userId, 'MEMBRO']);
    res.json({ message: 'Bem-vindo ao sindicato!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ingressar no sindicato.' });
  }
});

export default router;
