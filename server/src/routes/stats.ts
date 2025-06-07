import { Router, Request, Response } from 'express';
import { Op, WhereOptions, Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Task, Habit, HabitLog } from '../models';

interface TaskModel extends Model<InferAttributes<TaskModel>, InferCreationAttributes<TaskModel>> {
  id: CreationOptional<number>;
  text: string;
  completed: boolean;
  topic: string;
  userId: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  dueDate?: Date;
}

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
      where: { userId } as WhereOptions<TaskModel>,
    });

    const completedTasks = await Task.count({
      where: {
        userId,
        completed: true,
      } as WhereOptions<TaskModel>,
    });

    const dailyTasks = await Task.count({
      where: {
        userId,
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: startOfDay,
            },
          },
        ],
      } as WhereOptions<TaskModel>,
    });

    const weeklyTasks = await Task.count({
      where: {
        userId,
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: startOfWeek,
            },
          },
        ],
      } as WhereOptions<TaskModel>,
    });

    const monthlyTasks = await Task.count({
      where: {
        userId,
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: startOfMonth,
            },
          },
        ],
      } as WhereOptions<TaskModel>,
    });

    const dailyCompletedTasks = await Task.count({
      where: {
        userId,
        completed: true,
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: startOfDay,
            },
          },
        ],
      } as WhereOptions<TaskModel>,
    });

    const weeklyCompletedTasks = await Task.count({
      where: {
        userId,
        completed: true,
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: startOfWeek,
            },
          },
        ],
      } as WhereOptions<TaskModel>,
    });

    const monthlyCompletedTasks = await Task.count({
      where: {
        userId,
        completed: true,
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: startOfMonth,
            },
          },
        ],
      } as WhereOptions<TaskModel>,
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
      active: habits.filter(h => (h as any).logs?.length > 0).length,
      averageStreak: habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length || 0,
      bestPerforming: habits.sort((a, b) => b.currentStreak - a.currentStreak)[0]?.name || '',
    };

    const overdueTasks = await Task.count({
      where: {
        userId,
        completed: false,
        [Op.and]: [
          {
            dueDate: {
              [Op.lt]: new Date(),
            },
          },
        ],
      } as WhereOptions<TaskModel>,
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
          rate: Number(dailyTasks) > 0 ? (Number(dailyCompletedTasks) / Number(dailyTasks)) * 100 : 0,
        },
        weekly: {
          total: weeklyTasks,
          completed: weeklyCompletedTasks,
          rate: Number(weeklyTasks) > 0 ? (Number(weeklyCompletedTasks) / Number(weeklyTasks)) * 100 : 0,
        },
        monthly: {
          total: monthlyTasks,
          completed: monthlyCompletedTasks,
          rate: Number(monthlyTasks) > 0 ? (Number(monthlyCompletedTasks) / Number(monthlyTasks)) * 100 : 0,
        },
      },
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router; 