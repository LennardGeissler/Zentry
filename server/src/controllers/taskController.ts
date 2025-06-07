import { Request, Response } from 'express';
import Task from '../models/Task';

export const taskController = {
  // Get all daily tasks
  getDailyTasks: async (req: Request, res: Response) => {
    try {
      const tasks = await Task.findAll({
        where: {
          userId: 1, // Temporary until authentication is implemented
        },
        order: [['createdAt', 'DESC']],
      });
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
      res.status(500).json({ error: 'Failed to fetch daily tasks' });
    }
  },

  // Create a new task
  createTask: async (req: Request, res: Response) => {
    try {
      const { text, topic } = req.body;
      
      if (!text || !topic) {
        return res.status(400).json({ error: 'Text and topic are required' });
      }

      const task = await Task.create({
        text,
        topic,
        completed: false,
        userId: 1, // Temporary until authentication is implemented
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // Update a task
  updateTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const task = await Task.findOne({
        where: {
          id,
          userId: 1, // Temporary until authentication is implemented
        },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await task.update(updates);
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // Delete a task
  deleteTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const task = await Task.findOne({
        where: {
          id,
          userId: 1, // Temporary until authentication is implemented
        },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await task.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },
}; 