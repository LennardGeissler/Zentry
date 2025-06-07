"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Habit_1 = __importDefault(require("./Habit"));
class HabitEntry extends sequelize_1.Model {
}
HabitEntry.init({
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
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    completed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'HabitEntry',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['habitId', 'date', 'userId'],
        },
    ],
});
HabitEntry.belongsTo(Habit_1.default, { foreignKey: 'habitId' });
Habit_1.default.hasMany(HabitEntry, { foreignKey: 'habitId' });
exports.default = HabitEntry;
