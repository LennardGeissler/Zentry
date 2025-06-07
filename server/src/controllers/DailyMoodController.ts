import { Request, Response } from 'express';
import { DailyMood } from '../models';
import BaseController from './BaseController';
import { Op } from 'sequelize';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

class DailyMoodController extends BaseController<DailyMood> {
  constructor() {
    super(DailyMood);
  }

  async getMoodByDate(req: AuthenticatedRequest, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const mood = await DailyMood.findOne({
        where: {
          userId: 1, // Temporary until authentication is implemented
          date: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      return res.json(mood || {
        happy: false,
        productive: false,
        stressed: false,
        tired: false,
      });
    } catch (error) {
      console.error('Get mood by date error:', error);
      return res.status(500).json({ error: 'Failed to fetch mood' });
    }
  }

  async getMoodStats(req: AuthenticatedRequest, res: Response) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const moods = await DailyMood.findAll({
        where: {
          userId: 1, // Temporary until authentication is implemented
          date: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        order: [['date', 'ASC']],
      });

      const stats = {
        totalDays: moods.length,
        happyDays: moods.filter(mood => mood.get('happy')).length,
        productiveDays: moods.filter(mood => mood.get('productive')).length,
        stressedDays: moods.filter(mood => mood.get('stressed')).length,
        tiredDays: moods.filter(mood => mood.get('tired')).length,
      };

      return res.json(stats);
    } catch (error) {
      console.error('Get mood stats error:', error);
      return res.status(500).json({ error: 'Failed to fetch mood statistics' });
    }
  }

  // Override the create method to handle upsert for daily moods
  async create(req: Request, res: Response) {
    try {
      const date = new Date(req.body.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));

      // Try to find an existing mood for this date
      const existingMood = await this.model.findOne({
        where: {
          userId: 1, // Temporary until authentication is implemented
          date: startOfDay,
        },
      });

      let mood;
      if (existingMood) {
        // Update existing mood
        mood = await existingMood.update({
          happy: req.body.happy,
          productive: req.body.productive,
          stressed: req.body.stressed,
          tired: req.body.tired,
        });
      } else {
        // Create new mood
        mood = await this.model.create({
          ...req.body,
          userId: 1, // Temporary until authentication is implemented
          date: startOfDay,
        });
      }

      return res.status(201).json(mood);
    } catch (error) {
      console.error('Create/Update mood error:', error);
      return res.status(500).json({ error: 'Failed to save mood' });
    }
  }
}

export default new DailyMoodController(); 