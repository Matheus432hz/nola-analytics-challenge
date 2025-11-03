import { Router } from 'express';
import { runQuery } from '../controllers/queryController';

const router = Router();

router.post('/query', runQuery);

export default router;
