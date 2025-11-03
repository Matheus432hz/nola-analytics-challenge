import { Request, Response } from 'express';
import { executeQuery } from '../services/queryService';

export const runQuery = async (req: Request, res: Response) => {
  try {
    const result = await executeQuery(req.body);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Query execution error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
