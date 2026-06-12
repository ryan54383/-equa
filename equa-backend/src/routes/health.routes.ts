import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    message: 'EQUA API is running',
    timestamp: new Date().toISOString(),
    database: dbState[mongoose.connection.readyState] || 'unknown',
  });
});

export default router;
