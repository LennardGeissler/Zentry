import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface HabitAttributes {
  id: number;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
}

interface HabitCreationAttributes extends Omit<HabitAttributes, 'id' | 'currentStreak' | 'longestStreak'> {}

class Habit extends Model<HabitAttributes, HabitCreationAttributes> implements HabitAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public frequency!: 'daily' | 'weekly' | 'monthly';
  public targetDays!: number;
  public userId!: number;
  public currentStreak!: number;
  public longestStreak!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Habit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
      allowNull: false,
      defaultValue: 'daily',
    },
    targetDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Temporary until authentication is implemented
    },
    currentStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    longestStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'habits',
    modelName: 'Habit',
  }
);

export default Habit; 