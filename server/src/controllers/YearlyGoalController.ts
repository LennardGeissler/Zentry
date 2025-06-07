import { Request, Response } from 'express';
import { YearlyGoal } from '../models';
import BaseController from './BaseController';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

class YearlyGoalController extends BaseController<YearlyGoal> {
  constructor() {
    super(YearlyGoal);
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const goals = await YearlyGoal.findAll({
        where: {
          userId: 1, // Temporary until authentication is implemented
        },
        order: [['createdAt', 'DESC']],
      });
      return res.json(goals);
    } catch (error) {
      console.error('Get all error:', error);
      return res.status(500).json({ error: 'Failed to fetch goals' });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const goal = await YearlyGoal.create({
        ...req.body,
        userId: 1, // Temporary until authentication is implemented
      });
      return res.json(goal);
    } catch (error) {
      console.error('Create error:', error);
      return res.status(500).json({ error: 'Failed to create goal' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const goal = await YearlyGoal.findOne({
        where: {
          id: req.params.id,
          userId: 1, // Temporary until authentication is implemented
        },
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      await goal.update(req.body);
      return res.json(goal);
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update goal' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const goal = await YearlyGoal.findOne({
        where: {
          id: req.params.id,
          userId: 1, // Temporary until authentication is implemented
        },
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      await goal.destroy();
      return res.json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Failed to delete goal' });
    }
  }
}

export default new YearlyGoalController(); 