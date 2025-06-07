import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Habit from './Habit';

interface HabitLogAttributes {
  id: number;
  habitId: number;
  completedAt: Date;
  note?: string;
}

interface HabitLogCreationAttributes extends Omit<HabitLogAttributes, 'id'> {}

class HabitLog extends Model<HabitLogAttributes, HabitLogCreationAttributes> implements HabitLogAttributes {
  public id!: number;
  public habitId!: number;
  public completedAt!: Date;
  public note!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HabitLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    habitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Habit,
        key: 'id',
      },
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'habit_logs',
    modelName: 'HabitLog',
  }
);

// Define the association
HabitLog.belongsTo(Habit, {
  foreignKey: 'habitId',
  as: 'habit',
});

Habit.hasMany(HabitLog, {
  foreignKey: 'habitId',
  as: 'logs',
});

export default HabitLog; 