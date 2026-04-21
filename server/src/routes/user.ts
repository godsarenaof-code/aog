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

    res.json({
      nickname: user.nickname,
      rank: user.rank,
      mmr: user.mmr,
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
  const { rank } = req.query;
  try {
    let sql = 'SELECT nickname, rank, mmr FROM users';
    let params: any[] = [];

    if (rank) {
      sql += ' WHERE rank ILIKE $1';
      params.push(`%${rank}%`);
    }

    sql += ' ORDER BY mmr DESC LIMIT 50';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar ranking global.' });
  }
});

export default router;
