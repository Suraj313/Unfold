import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import searchRoutes from './routes/search.routes';

dotenv.config();

const app: Application = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/search', searchRoutes);

export default app;
