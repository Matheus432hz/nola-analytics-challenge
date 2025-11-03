import { Request, Response } from 'express';
import { getGeneralMetrics } from '../services/metricsService';

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await getGeneralMetrics();
    
    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
