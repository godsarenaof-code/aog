import { Router } from 'express';
import { query } from '../config/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// @route   GET /api/user/stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    
    // Buscar MMR e Rank atual do usuário
    const userRes = await query('SELECT nickname, rank, mmr FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    // Calcular estatísticas do histórico de partidas
    const matchesRes = await query(
      `SELECT 
        COUNT(*) as total_matches,
        COUNT(*) FILTER (WHERE placement = 1) as wins,
        COUNT(*) FILTER (WHERE placement <= 4) as top4
       FROM match_history 
       WHERE user_id = $1`,
      [userId]
    );
    const stats = matchesRes.rows[0];

    // Calcular Posição Global
    const posRes = await query(
      'SELECT COUNT(*) + 1 as position FROM users WHERE mmr > (SELECT mmr FROM users WHERE id = $1)',
      [userId]
    );
    const position = posRes.rows[0].position;
    
    res.json({
      nickname: user.nickname,
      rank: user.rank,
      mmr: user.mmr,
      globalPosition: parseInt(position),
      totalMatches: parseInt(stats.total_matches),
      wins: parseInt(stats.wins),
      top4: parseInt(stats.top4),
      winRate: stats.total_matches > 0 ? ((stats.wins / stats.total_matches) * 100).toFixed(1) : 0,
      top4Rate: stats.total_matches > 0 ? ((stats.top4 / stats.total_matches) * 100).toFixed(1) : 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas do usuário.' });
  }
});

// @route   GET /api/user/matches
router.get('/matches', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      'SELECT * FROM match_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [req.user?.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico de partidas.' });
  }
});

// @route   GET /api/user/leaderboard
router.get('/leaderboard', async (req, res) => {
  const { rank, userId } = req.query; // userId opcional para contexto
  try {
    let sql = 'SELECT nickname, rank, mmr FROM users';
    let params: any[] = [];

    if (rank) {
      sql += ' WHERE rank ILIKE $1';
      params.push(`%${rank}%`);
    }

    sql += ' ORDER BY mmr DESC LIMIT 100';
    
    const result = await query(sql, params);
    
    let userContext = null;
    if (userId) {
      const posRes = await query(
        'SELECT COUNT(*) + 1 as position FROM users WHERE mmr > (SELECT mmr FROM users WHERE id = $1)',
        [userId]
      );
      userContext = posRes.rows[0];
    }

    res.json({
      leaderboard: result.rows,
      userPosition: userContext ? parseInt(userContext.position) : null
    });
  } catch (err) {
// @route   POST /api/user/update-nickname
router.post('/update-nickname', authMiddleware, async (req: AuthRequest, res) => {
  const { newNickname } = req.body;
  const userId = req.user?.id;

  if (!newNickname || newNickname.length < 3 || newNickname.length > 16) {
    return res.status(400).json({ error: 'Nickname inválido (3-16 caracteres).' });
  }

  try {
    // 1. Verificar se o nickname já existe
    const exists = await query('SELECT id FROM users WHERE nickname = $1', [newNickname]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Este nickname já está em uso.' });
    }

    // 2. Buscar dados do usuário e saldo
    const userRes = await query('SELECT last_nickname_change FROM users WHERE id = $1', [userId]);
    const balanceRes = await query('SELECT essence FROM user_balances WHERE user_id = $1', [userId]);
    
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const lastChange = userRes.rows[0].last_nickname_change;
    const currentEssence = balanceRes.rows[0]?.essence || 0;

    // 3. Verificar Cooldown (30 dias)
    if (lastChange) {
      const daysSince = Math.floor((Date.now() - new Date(lastChange).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince < 30) {
        return res.status(403).json({ error: `Protocolo de Identidade em cooldown. Disponível em ${30 - daysSince} dias.` });
      }

      // 4. Verificar Custo (40 Essências se não for a primeira vez)
      if (currentEssence < 40) {
        return res.status(403).json({ error: 'Saldo de Essência insuficiente (40 necessárias).' });
      }

      // Deduzir custo
      await query('UPDATE user_balances SET essence = essence - 40 WHERE user_id = $1', [userId]);
    }

    // 5. Aplicar Troca
    await query(
      'UPDATE users SET nickname = $1, last_nickname_change = CURRENT_TIMESTAMP WHERE id = $2',
      [newNickname, userId]
    );

    res.json({ message: 'Nickname atualizado com sucesso!', nickname: newNickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar protocolo de alteração.' });
  }
});

export default router;
