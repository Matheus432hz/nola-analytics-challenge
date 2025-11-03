import { Router } from 'express';
import {
  topProducts,
  storePerformance,
  salesByChannel,
  salesByTime,
  inactiveCustomers,
} from '../controllers/analysisController';

const router = Router();

router.get('/analysis/top-products', topProducts);
router.get('/analysis/store-performance', storePerformance);
router.get('/analysis/sales-by-channel', salesByChannel);
router.get('/analysis/sales-by-time', salesByTime);
router.get('/analysis/inactive-customers', inactiveCustomers);

export default router;
