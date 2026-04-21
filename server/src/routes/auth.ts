import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aog_celestial_secret_2026';

// Rota base para teste
router.get('/', (req, res) => {
  res.json({ message: 'Arena of Gods Auth API Operacional', status: 'Celestial' });
});

// @route   POST /auth/register
// @desc    Registrar um novo invocador
router.post('/register', async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await query('SELECT id FROM users WHERE email = $1 OR nickname = $2', [email, nickname]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email ou Nickname já em uso.' });
    }

    // Criar hash da senha
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Salvar no banco
    const result = await query(
      'INSERT INTO users (email, password_hash, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname, rank, mmr',
      [email, password_hash, nickname]
    );

    const user = result.rows[0];

    // Gerar JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar conta. Tente novamente.' });
  }
});

// @route   POST /auth/login
// @desc    Autenticar invocador e obter token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await query(`
      SELECT u.*, c.tag as clan_tag, t.name as active_title, t.color as title_color
      FROM users u
      LEFT JOIN clan_members cm ON cm.user_id = u.id
      LEFT JOIN clans c ON c.id = cm.clan_id
      LEFT JOIN titles t ON t.id = u.selected_title_id
      WHERE u.email = $1
    `, [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    // Gerar JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Remover hash da senha antes de retornar
    const { password_hash, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// @route   GET /auth/me
// @desc    Obter dados do usuário atual via token
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await query(`
      SELECT u.id, u.email, u.nickname, u.rank, u.mmr, u.avatar, u.created_at, 
             c.tag as clan_tag, t.name as active_title, t.color as title_color
      FROM users u
      LEFT JOIN clan_members cm ON cm.user_id = u.id
      LEFT JOIN clans c ON c.id = cm.clan_id
      LEFT JOIN titles t ON t.id = u.selected_title_id
      WHERE u.id = $1
    `, [req.user?.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
});

export default router;
