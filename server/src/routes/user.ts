import { Router } from 'express';
import { query } from '../config/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// @route   GET /api/user/stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    
    // Buscar MMR, Rank, Clã e Título atual do usuário
    const userRes = await query(`
      SELECT u.nickname, u.rank, u.mmr, u.avatar, c.tag as clan_tag, t.name as active_title, t.color as title_color
      FROM users u
      LEFT JOIN clan_members cm ON cm.user_id = u.id
      LEFT JOIN clans c ON c.id = cm.clan_id
      LEFT JOIN titles t ON t.id = u.selected_title_id
      WHERE u.id = $1
    `, [userId]);
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
      top4Rate: stats.total_matches > 0 ? ((stats.top4 / stats.total_matches) * 100).toFixed(1) : 0,
      clanTag: user.clan_tag,
      activeTitle: user.active_title,
      titleColor: user.title_color
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
    let sql = `
      SELECT u.nickname, u.rank, u.mmr, c.tag as clan_tag, t.name as active_title, t.color as title_color
      FROM users u
      LEFT JOIN clan_members cm ON cm.user_id = u.id
      LEFT JOIN clans c ON c.id = cm.clan_id
      LEFT JOIN titles t ON t.id = u.selected_title_id
    `;
    let params: any[] = [];

    if (rank) {
      sql += ' WHERE u.rank ILIKE $1';
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
    res.status(500).json({ error: 'Erro ao buscar leaderboard.' });
  }
});

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

// @route   GET /api/user/titles
router.get('/titles', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    // Get all titles and check if unlocked
    const titlesRes = await query(`
      SELECT t.*, (ut.id IS NOT NULL) as unlocked
      FROM titles t
      LEFT JOIN user_titles ut ON ut.title_id = t.id AND ut.user_id = $1
      ORDER BY t.category, t.name
    `, [userId]);
    res.json(titlesRes.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar catálogo de títulos.' });
  }
});

// @route   POST /api/user/select-title
router.post('/select-title', authMiddleware, async (req: AuthRequest, res) => {
  const { titleId } = req.body; // titleId can be null to remove
  const userId = req.user?.id;

  try {
    if (titleId) {
      // Check if unlocked
      const checkRes = await query('SELECT id FROM user_titles WHERE user_id = $1 AND title_id = $2', [userId, titleId]);
      if (checkRes.rows.length === 0) {
        return res.status(403).json({ error: 'Título não desbloqueado.' });
      }
    }

    await query('UPDATE users SET selected_title_id = $1 WHERE id = $2', [titleId, userId]);
    res.json({ message: 'Título atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao selecionar título.' });
  }
});

// @route   POST /api/user/update-avatar
router.post('/update-avatar', authMiddleware, async (req: AuthRequest, res) => {
  const { avatarUrl } = req.body;
  const userId = req.user?.id;

  try {
    await query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarUrl, userId]);
    res.json({ message: 'Avatar atualizado com sucesso!', avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar avatar.' });
  }
});

export default router;
