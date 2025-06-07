import { Router } from 'express';
import yearlyGoalController from '../controllers/YearlyGoalController';

const router = Router();

router.get('/', yearlyGoalController.getAll.bind(yearlyGoalController));
router.get('/:id', yearlyGoalController.getById.bind(yearlyGoalController));
router.post('/', yearlyGoalController.create.bind(yearlyGoalController));
router.put('/:id', yearlyGoalController.update.bind(yearlyGoalController));
router.delete('/:id', yearlyGoalController.delete.bind(yearlyGoalController));

export default router; 