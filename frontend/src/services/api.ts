import axios from 'axios';
import type { Metrics, TopProduct, StorePerformance } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const getMetrics = async (): Promise<Metrics> => {
  const response = await api.get('/metrics');
  return response.data.data;
};

export const getTopProducts = async (limit = 10): Promise<TopProduct[]> => {
  const response = await api.get(`/analysis/top-products?limit=${limit}`);
  return response.data.data;
};

export const getStorePerformance = async (): Promise<StorePerformance[]> => {
  const response = await api.get('/analysis/store-performance');
  return response.data.data;
};

export default api;
