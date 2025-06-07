import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface CalendarEventAttributes {
  id: number;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  allDay: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CalendarEventCreationAttributes extends Omit<CalendarEventAttributes, 'id'> {}

class CalendarEvent extends Model<CalendarEventAttributes, CalendarEventCreationAttributes> implements CalendarEventAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public startTime!: Date;
  public endTime!: Date;
  public color!: string;
  public allDay!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CalendarEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    allDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'calendar_events',
    timestamps: true,
  }
);

export default CalendarEvent; 