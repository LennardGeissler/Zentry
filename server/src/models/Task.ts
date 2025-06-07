import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface TaskAttributes {
  id: number;
  text: string;
  completed: boolean;
  topic: string;
  userId: number; // For future authentication implementation
}

interface TaskCreationAttributes extends Omit<TaskAttributes, 'id'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public text!: string;
  public completed!: boolean;
  public topic!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Temporary default until authentication is implemented
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    modelName: 'Task',
  }
);

export default Task; 