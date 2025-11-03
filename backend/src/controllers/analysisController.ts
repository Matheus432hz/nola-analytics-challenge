import { Request, Response } from 'express';
import {
  getTopProducts,
  getStorePerformance,
  getSalesByChannel,
  getSalesByTime,
  getInactiveCustomers,
} from '../services/analysisService';

export const topProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await getTopProducts(limit);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const storePerformance = async (req: Request, res: Response) => {
  try {
    const data = await getStorePerformance();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching store performance:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const salesByChannel = async (req: Request, res: Response) => {
  try {
    const data = await getSalesByChannel();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching sales by channel:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const salesByTime = async (req: Request, res: Response) => {
  try {
    const data = await getSalesByTime();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching sales by time:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const inactiveCustomers = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = await getInactiveCustomers(days);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching inactive customers:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
