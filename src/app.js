import express from 'express';
import helmet from 'helmet';
import authRouter from './routes/auth.js';
import nutritionRouter from './routes/nutrition.js';
import profileRouter from './routes/profile.js';
import { errorHandler, notFound } from './middleware/error-handler.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/nutrition', nutritionRouter);
app.use(notFound);
app.use(errorHandler);
