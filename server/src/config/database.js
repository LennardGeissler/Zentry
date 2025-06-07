"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize({
    dialect: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'zentry-admin',
    password: process.env.DB_PASSWORD || 'zentry123',
    database: process.env.DB_NAME || 'zentry',
    dialectOptions: {
        options: {
            trustServerCertificate: true,
        },
    },
});
exports.default = sequelize;
