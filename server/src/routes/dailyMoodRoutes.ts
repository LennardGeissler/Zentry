import { Router } from 'express';
import dailyMoodController from '../controllers/DailyMoodController';

const router = Router();

router.get('/', dailyMoodController.getAll.bind(dailyMoodController));
router.get('/by-date', dailyMoodController.getMoodByDate.bind(dailyMoodController));
router.get('/stats', dailyMoodController.getMoodStats.bind(dailyMoodController));
router.get('/:id', dailyMoodController.getById.bind(dailyMoodController));
router.post('/', dailyMoodController.create.bind(dailyMoodController));
router.put('/:id', dailyMoodController.update.bind(dailyMoodController));
router.delete('/:id', dailyMoodController.delete.bind(dailyMoodController));

export default router; 