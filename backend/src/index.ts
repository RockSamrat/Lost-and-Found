import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server calls (no Origin header) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth',  authRoutes);
app.use('/items', itemsRoutes);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => console.log(`API listening on :${PORT}`));
