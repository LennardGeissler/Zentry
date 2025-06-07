import { Router } from 'express';
import habitController from '../controllers/HabitController';

const router = Router();

router.get('/', habitController.getAll.bind(habitController));
router.get('/:id', habitController.getById.bind(habitController));
router.get('/:habitId/stats', habitController.getHabitStats.bind(habitController));
router.get('/:habitId/logs', habitController.getHabitLogs.bind(habitController));
router.post('/', habitController.create.bind(habitController));
router.post('/:habitId/log', habitController.logHabit.bind(habitController));
router.put('/:id', habitController.update.bind(habitController));
router.delete('/:id', habitController.delete.bind(habitController));

export default router; 