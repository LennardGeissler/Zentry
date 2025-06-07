import { Request, Response } from 'express';
import { Habit, HabitEntry } from '../models';
import BaseController from './BaseController';
import { Op } from 'sequelize';
import HabitLog from '../models/HabitLog';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

class HabitController extends BaseController<Habit> {
  constructor() {
    super(Habit);
  }

  async getHabitsWithEntries(req: AuthenticatedRequest, res: Response) {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

      const habits = await Habit.findAll({
        where: { userId: 1 }, // Temporary until authentication is implemented
        include: [{
          model: HabitEntry,
          where: {
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
          required: false,
        }],
      });

      return res.json(habits);
    } catch (error) {
      console.error('Get habits with entries error:', error);
      return res.status(500).json({ error: 'Failed to fetch habits with entries' });
    }
  }

  async toggleHabitEntry(req: AuthenticatedRequest, res: Response) {
    try {
      const { habitId } = req.params;
      const { date } = req.body;
      const parsedDate = new Date(date);

      const [entry, created] = await HabitEntry.findOrCreate({
        where: {
          habitId: parseInt(habitId),
          userId: 1, // Temporary until authentication is implemented
          date: parsedDate,
        },
        defaults: {
          habitId: parseInt(habitId),
          userId: 1, // Temporary until authentication is implemented
          date: parsedDate,
          completed: true,
        },
      });

      if (!created) {
        await entry.update({ completed: !entry.get('completed') });
      }

      return res.json(entry);
    } catch (error) {
      console.error('Toggle habit entry error:', error);
      return res.status(500).json({ error: 'Failed to toggle habit entry' });
    }
  }

  async getHabitStats(req: AuthenticatedRequest, res: Response) {
    try {
      const { habitId } = req.params;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const entries = await HabitEntry.findAll({
        where: {
          habitId: parseInt(habitId),
          userId: 1, // Temporary until authentication is implemented
          date: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        order: [['date', 'ASC']],
      });

      const stats = {
        totalEntries: entries.length,
        completedEntries: entries.filter(entry => entry.get('completed')).length,
        completionRate: 0,
        streak: 0,
      };

      stats.completionRate = (stats.completedEntries / stats.totalEntries) * 100;

      // Calculate current streak
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        const entryDate = new Date(entry.get('date'));
        entryDate.setHours(0, 0, 0, 0);

        if (entry.get('completed') && 
            (i === entries.length - 1 || 
             entryDate.getTime() === today.getTime() - streak * 24 * 60 * 60 * 1000)) {
          streak++;
        } else {
          break;
        }
      }

      stats.streak = streak;

      return res.json(stats);
    } catch (error) {
      console.error('Get habit stats error:', error);
      return res.status(500).json({ error: 'Failed to fetch habit statistics' });
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const habits = await Habit.findAll({
        where: {
          userId: 1, // Temporary until authentication is implemented
        },
        include: [{
          model: HabitLog,
          as: 'logs',
          limit: 14, // Get last 14 days of logs
          order: [['completedAt', 'DESC']],
        }],
        order: [['createdAt', 'DESC']],
      });
      return res.json(habits);
    } catch (error) {
      console.error('Get all error:', error);
      return res.status(500).json({ error: 'Failed to fetch habits' });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const habit = await Habit.create({
        ...req.body,
        userId: 1, // Temporary until authentication is implemented
      });
      return res.json(habit);
    } catch (error) {
      console.error('Create error:', error);
      return res.status(500).json({ error: 'Failed to create habit' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const habit = await Habit.findOne({
        where: {
          id: req.params.id,
          userId: 1, // Temporary until authentication is implemented
        },
      });

      if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      await habit.update(req.body);
      return res.json(habit);
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update habit' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const habit = await Habit.findOne({
        where: {
          id: req.params.id,
          userId: 1, // Temporary until authentication is implemented
        },
      });

      if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      await habit.destroy();
      return res.json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Failed to delete habit' });
    }
  }

  async logHabit(req: AuthenticatedRequest, res: Response) {
    try {
      const { habitId } = req.params;
      const { note, completedAt } = req.body;

      const habit = await Habit.findOne({
        where: {
          id: habitId,
          userId: 1, // Temporary until authentication is implemented
        },
      });

      if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      const log = await HabitLog.create({
        habitId: parseInt(habitId),
        completedAt: completedAt || new Date(),
        note,
      });

      // Update streak
      const recentLogs = await HabitLog.findAll({
        where: {
          habitId,
          completedAt: {
            [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
          },
        },
        order: [['completedAt', 'DESC']],
      });

      let currentStreak = 0;
      for (let i = 0; i < recentLogs.length; i++) {
        if (i === 0 || 
            new Date(recentLogs[i].completedAt).toDateString() === 
            new Date(new Date().setDate(new Date().getDate() - i)).toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      }

      await habit.update({
        currentStreak,
        longestStreak: Math.max(currentStreak, habit.longestStreak || 0),
      });

      return res.status(201).json(log);
    } catch (error) {
      console.error('Error logging habit:', error);
      return res.status(500).json({ error: 'Failed to log habit' });
    }
  }

  async getHabitLogs(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const { id } = req.params;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const logs = await HabitLog.findAll({
        where: {
          habitId: id,
          completedAt: {
            [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
          },
        },
        order: [['completedAt', 'DESC']],
      });

      return res.json(logs);
    } catch (error) {
      console.error('Error fetching habit logs:', error);
      return res.status(500).json({ error: 'Failed to fetch habit logs' });
    }
  }
}

export default new HabitController(); 