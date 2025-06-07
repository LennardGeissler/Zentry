import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface DailyTaskAttributes {
  id: number;
  text: string;
  completed: boolean;
  topic: 'University' | 'Job' | 'Fitness' | 'Appointments' | 'Others';
  userId: number;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
}

class DailyTask extends Model<DailyTaskAttributes> implements DailyTaskAttributes {
  public id!: number;
  public text!: string;
  public completed!: boolean;
  public topic!: 'University' | 'Job' | 'Fitness' | 'Appointments' | 'Others';
  public userId!: number;
  public priority!: 'low' | 'medium' | 'high';
  public dueDate!: Date;
}

DailyTask.init(
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
      type: DataTypes.ENUM('University', 'Job', 'Fitness', 'Appointments', 'Others'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'DailyTask',
    timestamps: true,
  }
);

export default DailyTask; 