import { Router } from 'express';
import stayInfoRoutes from './stayInfo.routes';

const router = Router();

router.use('/stay', stayInfoRoutes);

export default router;
