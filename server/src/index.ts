import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'A Arena of Gods está operacional.', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Servidor AOG rodando na porta ${PORT}`);
  console.log(`🔗 Endpoint de Auth: http://localhost:${PORT}/api/auth`);
});
