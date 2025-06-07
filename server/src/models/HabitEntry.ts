import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Habit from './Habit';

interface HabitEntryAttributes {
  id: number;
  habitId: number;
  userId: number;
  date: Date;
  completed: boolean;
}

interface HabitEntryCreationAttributes extends Optional<HabitEntryAttributes, 'id'> {}

class HabitEntry extends Model<HabitEntryAttributes, HabitEntryCreationAttributes> implements HabitEntryAttributes {
  public id!: number;
  public habitId!: number;
  public userId!: number;
  public date!: Date;
  public completed!: boolean;
}

HabitEntry.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'HabitEntry',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['habitId', 'date', 'userId'],
      },
    ],
  }
);

HabitEntry.belongsTo(Habit, { foreignKey: 'habitId' });
Habit.hasMany(HabitEntry, { foreignKey: 'habitId' });

export default HabitEntry; 