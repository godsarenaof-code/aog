import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// @route   GET /api/game/champions
router.get('/champions', async (req, res) => {
  try {
    const result = await query('SELECT * FROM champions ORDER BY tier, name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar campeões.' });
  }
});

// @route   GET /api/game/traits
router.get('/traits', async (req, res) => {
  try {
    const result = await query('SELECT * FROM traits ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sinergias.' });
  }
});

export default router;
