import axios from 'axios';
import type { Metrics, TopProduct, StorePerformance } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const getMetrics = async (filters?: { storeId?: string; channelId?: string; days?: string }): Promise<Metrics> => {
  const params = new URLSearchParams();
  if (filters?.storeId && filters.storeId !== 'all') params.append('store_id', filters.storeId);
  if (filters?.channelId && filters.channelId !== 'all') params.append('channel_id', filters.channelId);
  if (filters?.days && filters.days !== 'all') params.append('days', filters.days);
  
  const response = await api.get(`/analysis/metrics?${params.toString()}`);
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
