import { Request, Response } from 'express';
import { DailyTask } from '../models';
import BaseController from './BaseController';
import { Op } from 'sequelize';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

class DailyTaskController extends BaseController<DailyTask> {
  constructor() {
    super(DailyTask);
  }

  async getTasksByDate(req: AuthenticatedRequest, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const tasks = await DailyTask.findAll({
        where: {
          userId: req.user?.id,
          dueDate: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
        order: [['priority', 'DESC']],
      });

      return res.json(tasks);
    } catch (error) {
      console.error('Get tasks by date error:', error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }
}

export default new DailyTaskController(); 