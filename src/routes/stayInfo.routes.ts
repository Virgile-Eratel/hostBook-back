import { Router } from 'express';
import stayInfoController, {upload} from '../controllers/stayInfo.controller';

const router = Router();

router.post('/', stayInfoController.createStay);

router.get('/:id', stayInfoController.getStayById);

router.post('/pdf', upload.single('file'), stayInfoController.analyzePdf);

router.get('/', stayInfoController.getAllStays);

export default router;
