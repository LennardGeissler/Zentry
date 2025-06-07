"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class DailyMood extends sequelize_1.Model {
}
DailyMood.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    happy: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    productive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    stressed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tired: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'DailyMood',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'date'],
        },
    ],
});
exports.default = DailyMood;
