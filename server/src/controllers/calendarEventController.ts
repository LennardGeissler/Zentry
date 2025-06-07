import { Request, Response } from 'express';
import { Op } from 'sequelize';
import CalendarEvent from '../models/CalendarEvent';

export const calendarEventController = {
  async getEvents(req: Request, res: Response) {
    try {
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid start date or end date' });
      }

      const events = await CalendarEvent.findAll({
        where: {
          [Op.or]: [
            {
              startTime: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              endTime: {
                [Op.between]: [startDate, endDate],
              },
            },
          ],
        },
        order: [['startTime', 'ASC']],
      });

      res.json(events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async createEvent(req: Request, res: Response) {
    try {
      const event = await CalendarEvent.create(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await CalendarEvent.findByPk(id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      await event.update(req.body);
      res.json(event);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await CalendarEvent.findByPk(id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      await event.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}; 