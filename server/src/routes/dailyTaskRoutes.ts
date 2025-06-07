import { Router } from 'express';
import dailyTaskController from '../controllers/DailyTaskController';

const router = Router();

router.get('/', dailyTaskController.getAll.bind(dailyTaskController));
router.get('/by-date', dailyTaskController.getTasksByDate.bind(dailyTaskController));
router.get('/:id', dailyTaskController.getById.bind(dailyTaskController));
router.post('/', dailyTaskController.create.bind(dailyTaskController));
router.put('/:id', dailyTaskController.update.bind(dailyTaskController));
router.delete('/:id', dailyTaskController.delete.bind(dailyTaskController));

export default router; 