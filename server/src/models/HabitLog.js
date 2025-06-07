"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Habit_1 = __importDefault(require("./Habit"));
class HabitLog extends sequelize_1.Model {
}
HabitLog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    habitId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Habit_1.default,
            key: 'id',
        },
    },
    completedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    note: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'habit_logs',
    modelName: 'HabitLog',
});
// Define the association
HabitLog.belongsTo(Habit_1.default, {
    foreignKey: 'habitId',
    as: 'habit',
});
Habit_1.default.hasMany(HabitLog, {
    foreignKey: 'habitId',
    as: 'logs',
});
exports.default = HabitLog;
