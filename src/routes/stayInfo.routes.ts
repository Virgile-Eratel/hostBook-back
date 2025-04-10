import { Router } from 'express';
import stayInfoController from '../controllers/stayInfo.controller';

const router = Router();

// Create a new stay
router.post('/', stayInfoController.createStay);

// Get a stay by ID
router.get('/:id', stayInfoController.getStayById);

// Get all stays
router.get('/', stayInfoController.getAllStays);

export default router;
