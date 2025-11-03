import { Router } from 'express';
import {
  topProducts,
  storePerformance,
  salesByChannel,
  salesByTime,
  inactiveCustomers,
  getStores,
  getChannels,
  getMetrics,
} from '../controllers/analysisController';

const router = Router();

// Rotas de filtros
router.get('/analysis/stores', getStores);
router.get('/analysis/channels', getChannels);
router.get('/analysis/metrics', getMetrics);

// Rotas de análises
router.get('/analysis/top-products', topProducts);
router.get('/analysis/store-performance', storePerformance);
router.get('/analysis/sales-by-channel', salesByChannel);
router.get('/analysis/sales-by-time', salesByTime);
router.get('/analysis/inactive-customers', inactiveCustomers);

export default router;
