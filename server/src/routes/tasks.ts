import express from 'express';
import { taskController } from '../controllers/taskController';

const router = express.Router();

// Get all daily tasks
router.get('/daily', taskController.getDailyTasks);

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

export default router; 