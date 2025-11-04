import { Request, Response } from 'express';
import {
  getTopProducts,
  getStorePerformance,
  getSalesByChannel,
  getSalesByTime,
  getInactiveCustomers,
} from '../services/analysisService';
import pool from '../config/database';

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


export const getStores = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        city
      FROM stores
      ORDER BY name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};


export const getChannels = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name
      FROM channels
      ORDER BY name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
};


export const getMetrics = async (req: Request, res: Response) => {
  try {
    const { store_id, channel_id, days } = req.query;
    
    let whereConditions: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    // Filtro de loja
    if (store_id && store_id !== 'all') {
      whereConditions.push(`s.store_id = $${paramCounter}`);
      values.push(store_id);
      paramCounter++;
    }

    // Filtro de canal
    if (channel_id && channel_id !== 'all') {
      whereConditions.push(`s.channel_id = $${paramCounter}`);
      values.push(channel_id);
      paramCounter++;
    }

    // Filtro de período
    if (days && days !== 'all') {
      whereConditions.push(`s.created_at >= NOW() - INTERVAL '${parseInt(days as string)} days'`);
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    const query = `
      SELECT 
        COUNT(CASE WHEN sale_status_desc = 'COMPLETED' THEN 1 END) as completed_sales,
        COUNT(CASE WHEN sale_status_desc = 'CANCELED' THEN 1 END) as canceled_sales,
        COALESCE(SUM(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount END), 0) as average_ticket,
        COUNT(DISTINCT customer_id) as unique_customers,
        COUNT(DISTINCT store_id) as active_stores

      FROM sales s
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    const metrics = result.rows[0];

    res.json({
      success: true,
      data: {
        totalSales: parseInt(metrics.completed_sales),
        totalRevenue: parseFloat(metrics.total_revenue),
        averageTicket: parseFloat(metrics.average_ticket),
        totalStores: parseInt(metrics.active_stores),
        totalProducts: 498,
        totalCustomers: parseInt(metrics.unique_customers)
      }
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
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

