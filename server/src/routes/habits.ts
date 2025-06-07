import express from 'express';
import habitController from '../controllers/HabitController';

const router = express.Router();

// Get all habits with recent logs
router.get('/', habitController.getAll.bind(habitController));

// Create a new habit
router.post('/', habitController.create.bind(habitController));

// Update a habit
router.put('/:id', habitController.update.bind(habitController));

// Delete a habit
router.delete('/:id', habitController.delete.bind(habitController));

// Log habit completion
router.post('/:id/log', habitController.logHabit.bind(habitController));

// Get habit logs for a date range
router.get('/:id/logs', habitController.getHabitLogs.bind(habitController));

// Get habit statistics
router.get('/:id/stats', habitController.getHabitStats.bind(habitController));

export default router; 