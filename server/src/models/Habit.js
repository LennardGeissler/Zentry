"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Habit extends sequelize_1.Model {
}
Habit.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    frequency: {
        type: sequelize_1.DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: false,
        defaultValue: 'daily',
    },
    targetDays: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Temporary until authentication is implemented
    },
    currentStreak: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    longestStreak: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.default,
    tableName: 'habits',
    modelName: 'Habit',
});
exports.default = Habit;
