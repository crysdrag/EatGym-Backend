import http from 'node:http';
import express from 'express';
import helmet from 'helmet';
import authRouter from './routes/auth.js';
import nutritionRouter from './routes/nutrition.js';
import profileRouter from './routes/profile.js';
import recipesRouter from './routes/recipes.js';
import inventoryRouter from './routes/inventory.js';
import nutritionLogsRouter from './routes/nutrition-logs.js';
import achievementsRouter from './routes/achievements.js';
import compensationRouter from './routes/compensation.js';
import mealPrepRouter from './routes/meal-prep.js';
import { errorHandler, notFound } from './middleware/error-handler.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());

// Proxy AI Food Detection to eatgym-ai container (FastAPI port 8000)
app.use('/api/v1/detect', (req, res) => {
  const aiHost = process.env.AI_HOST || (process.env.NODE_ENV === 'production' ? 'ai' : '127.0.0.1');
  const aiPort = process.env.AI_PORT || 8000;
  const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

  const proxyReq = http.request(
    {
      hostname: aiHost,
      port: aiPort,
      path: '/api/v1/detect' + search,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${aiHost}:${aiPort}`,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  proxyReq.on('error', (err) => {
    console.error('AI Proxy Error:', err);
    res.status(502).json({ error: { code: 'AI_PROXY_ERROR', message: err.message } });
  });

  req.pipe(proxyReq, { end: true });
});

app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/nutrition', compensationRouter);
app.use('/api/meal-prep', mealPrepRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api', recipesRouter);
app.use('/api', inventoryRouter);
app.use('/api', nutritionLogsRouter);
app.use('/api', compensationRouter);
app.use('/api', mealPrepRouter);
app.use(notFound);
app.use(errorHandler);
