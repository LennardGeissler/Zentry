import { Request, Response } from 'express';
import { Model, ModelStatic, WhereOptions } from 'sequelize';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export default class BaseController<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const item = await this.model.create({
        ...req.body,
        userId: req.user?.id,
      });
      return res.status(201).json(item);
    } catch (error) {
      console.error('Create error:', error);
      return res.status(500).json({ error: 'Failed to create item' });
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const items = await this.model.findAll({
        where: { userId: req.user?.id } as WhereOptions<T>,
      });
      return res.json(items);
    } catch (error) {
      console.error('Get all error:', error);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const item = await this.model.findOne({
        where: {
          id: parseInt(req.params.id),
          userId: req.user?.id,
        } as WhereOptions<T>,
      });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      return res.json(item);
    } catch (error) {
      console.error('Get by ID error:', error);
      return res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const [updated] = await this.model.update(req.body, {
        where: {
          id: parseInt(req.params.id),
          userId: req.user?.id,
        } as WhereOptions<T>,
      });
      if (!updated) {
        return res.status(404).json({ error: 'Item not found' });
      }
      const item = await this.model.findByPk(parseInt(req.params.id));
      return res.json(item);
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update item' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const deleted = await this.model.destroy({
        where: {
          id: parseInt(req.params.id),
          userId: req.user?.id,
        } as WhereOptions<T>,
      });
      if (!deleted) {
        return res.status(404).json({ error: 'Item not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Failed to delete item' });
    }
  }
} 