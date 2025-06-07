import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface DailyMoodAttributes {
  id: number;
  userId: number;
  date: Date;
  happy: boolean;
  productive: boolean;
  stressed: boolean;
  tired: boolean;
}

class DailyMood extends Model<DailyMoodAttributes> implements DailyMoodAttributes {
  public id!: number;
  public userId!: number;
  public date!: Date;
  public happy!: boolean;
  public productive!: boolean;
  public stressed!: boolean;
  public tired!: boolean;
}

DailyMood.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    happy: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    productive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stressed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'DailyMood',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'date'],
      },
    ],
  }
);

export default DailyMood; 