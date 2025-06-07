import { Router } from 'express';
import yearlyGoalRoutes from './yearlyGoalRoutes';
import taskRoutes from './tasks';
import habitRoutes from './habitRoutes';
import dailyMoodRoutes from './dailyMoodRoutes';
import calendarEventRoutes from './calendarEventRoutes';

const router = Router();

router.use('/yearly-goals', yearlyGoalRoutes);
router.use('/tasks', taskRoutes);
router.use('/habits', habitRoutes);
router.use('/daily-moods', dailyMoodRoutes);
router.use('/calendar-events', calendarEventRoutes);

export default router; 