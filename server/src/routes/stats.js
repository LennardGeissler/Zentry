"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const router = (0, express_1.Router)();
// Get user statistics
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.body.userId;
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        // Task statistics
        const totalTasks = yield models_1.Task.count({
            where: { userId },
        });
        const completedTasks = yield models_1.Task.count({
            where: {
                userId,
                completed: true,
            },
        });
        const dailyTasks = yield models_1.Task.count({
            where: {
                userId,
                [sequelize_1.Op.and]: [
                    {
                        createdAt: {
                            [sequelize_1.Op.gte]: startOfDay,
                        },
                    },
                ],
            },
        });
        const weeklyTasks = yield models_1.Task.count({
            where: {
                userId,
                [sequelize_1.Op.and]: [
                    {
                        createdAt: {
                            [sequelize_1.Op.gte]: startOfWeek,
                        },
                    },
                ],
            },
        });
        const monthlyTasks = yield models_1.Task.count({
            where: {
                userId,
                [sequelize_1.Op.and]: [
                    {
                        createdAt: {
                            [sequelize_1.Op.gte]: startOfMonth,
                        },
                    },
                ],
            },
        });
        const dailyCompletedTasks = yield models_1.Task.count({
            where: {
                userId,
                completed: true,
                [sequelize_1.Op.and]: [
                    {
                        createdAt: {
                            [sequelize_1.Op.gte]: startOfDay,
                        },
                    },
                ],
            },
        });
        const weeklyCompletedTasks = yield models_1.Task.count({
            where: {
                userId,
                completed: true,
                [sequelize_1.Op.and]: [
                    {
                        createdAt: {
                            [sequelize_1.Op.gte]: startOfWeek,
                        },
                    },
                ],
            },
        });
        const monthlyCompletedTasks = yield models_1.Task.count({
            where: {
                userId,
                completed: true,
                [sequelize_1.Op.and]: [
                    {
                        createdAt: {
                            [sequelize_1.Op.gte]: startOfMonth,
                        },
                    },
                ],
            },
        });
        // Habit statistics
        const habits = yield models_1.Habit.findAll({
            where: { userId },
            include: [{
                    model: models_1.HabitLog,
                    as: 'logs',
                    where: {
                        completedAt: {
                            [sequelize_1.Op.gte]: startOfWeek,
                        },
                    },
                    required: false,
                }],
        });
        const habitStats = {
            total: habits.length,
            active: habits.filter(h => { var _a; return ((_a = h.logs) === null || _a === void 0 ? void 0 : _a.length) > 0; }).length,
            averageStreak: habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length || 0,
            bestPerforming: ((_a = habits.sort((a, b) => b.currentStreak - a.currentStreak)[0]) === null || _a === void 0 ? void 0 : _a.name) || '',
        };
        const overdueTasks = yield models_1.Task.count({
            where: {
                userId,
                completed: false,
                [sequelize_1.Op.and]: [
                    {
                        dueDate: {
                            [sequelize_1.Op.lt]: new Date(),
                        },
                    },
                ],
            },
        });
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const statistics = {
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                completion_rate: completionRate,
                overdue: overdueTasks,
            },
            habits: habitStats,
            timeframes: {
                daily: {
                    total: dailyTasks,
                    completed: dailyCompletedTasks,
                    rate: Number(dailyTasks) > 0 ? (Number(dailyCompletedTasks) / Number(dailyTasks)) * 100 : 0,
                },
                weekly: {
                    total: weeklyTasks,
                    completed: weeklyCompletedTasks,
                    rate: Number(weeklyTasks) > 0 ? (Number(weeklyCompletedTasks) / Number(weeklyTasks)) * 100 : 0,
                },
                monthly: {
                    total: monthlyTasks,
                    completed: monthlyCompletedTasks,
                    rate: Number(monthlyTasks) > 0 ? (Number(monthlyCompletedTasks) / Number(monthlyTasks)) * 100 : 0,
                },
            },
        };
        res.json(statistics);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
}));
exports.default = router;
