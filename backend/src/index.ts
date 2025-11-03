import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import metricsRoutes from './routes/metricsRoutes';
import queryRoutes from './routes/queryRoutes';
import analysisRoutes from './routes/analysisRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use('/api', metricsRoutes);
app.use('/api', queryRoutes);
app.use('/api', analysisRoutes);


// Health check route
app.get('/health', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'API is running',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Test database route
app.get('/api/test', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM sales');
    res.json({
      message: 'Database query successful',
      totalSales: result.rows[0].total,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Test endpoint: http://localhost:${PORT}/api/test`);
});
