import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { Task, Habit, HabitLog } from '../models';

const router = Router();

// Get user statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Task statistics
    const totalTasks = await Task.count({
      where: { userId },
    });

    const completedTasks = await Task.count({
      where: {
        userId,
        completed: true,
      },
    });

    const dailyTasks = await Task.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startOfDay,
        },
      },
    });

    const weeklyTasks = await Task.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startOfWeek,
        },
      },
    });

    const monthlyTasks = await Task.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    const dailyCompletedTasks = await Task.count({
      where: {
        userId,
        completed: true,
        createdAt: {
          [Op.gte]: startOfDay,
        },
      },
    });

    const weeklyCompletedTasks = await Task.count({
      where: {
        userId,
        completed: true,
        createdAt: {
          [Op.gte]: startOfWeek,
        },
      },
    });

    const monthlyCompletedTasks = await Task.count({
      where: {
        userId,
        completed: true,
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    // Habit statistics
    const habits = await Habit.findAll({
      where: { userId },
      include: [{
        model: HabitLog,
        as: 'logs',
        where: {
          completedAt: {
            [Op.gte]: startOfWeek,
          },
        },
        required: false,
      }],
    });

    const habitStats = {
      total: habits.length,
      active: habits.filter(h => h.logs && h.logs.length > 0).length,
      averageStreak: habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length || 0,
      bestPerforming: habits.sort((a, b) => b.currentStreak - a.currentStreak)[0]?.title || '',
    };

    const overdueTasks = await Task.count({
      where: {
        userId,
        completed: false,
        dueDate: {
          [Op.lt]: new Date(),
        },
      },
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const statistics = {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        completion_rate: completionRate,
        overdue: overdueTasks,
      },
      habits: habitStats,
      timeframes: {
        daily: {
          total: dailyTasks,
          completed: dailyCompletedTasks,
          rate: dailyTasks > 0 ? (dailyCompletedTasks / dailyTasks) * 100 : 0,
        },
        weekly: {
          total: weeklyTasks,
          completed: weeklyCompletedTasks,
          rate: weeklyTasks > 0 ? (weeklyCompletedTasks / weeklyTasks) * 100 : 0,
        },
        monthly: {
          total: monthlyTasks,
          completed: monthlyCompletedTasks,
          rate: monthlyTasks > 0 ? (monthlyCompletedTasks / monthlyTasks) * 100 : 0,
        },
      },
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router; 