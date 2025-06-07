import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface YearlyGoalAttributes {
  id: number;
  text: string;
  completed: boolean;
  topic: 'Career' | 'Education' | 'Health' | 'Personal' | 'Finance';
  userId: number;
}

class YearlyGoal extends Model<YearlyGoalAttributes> implements YearlyGoalAttributes {
  public id!: number;
  public text!: string;
  public completed!: boolean;
  public topic!: 'Career' | 'Education' | 'Health' | 'Personal' | 'Finance';
  public userId!: number;
}

YearlyGoal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    topic: {
      type: DataTypes.ENUM('Career', 'Education', 'Health', 'Personal', 'Finance'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'YearlyGoal',
    timestamps: true,
  }
);

export default YearlyGoal; 