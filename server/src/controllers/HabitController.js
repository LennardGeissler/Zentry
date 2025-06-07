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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const BaseController_1 = __importDefault(require("./BaseController"));
const sequelize_1 = require("sequelize");
const HabitLog_1 = __importDefault(require("../models/HabitLog"));
class HabitController extends BaseController_1.default {
    constructor() {
        super(models_1.Habit);
    }
    getHabitsWithEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
                const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
                const habits = yield models_1.Habit.findAll({
                    where: { userId: 1 }, // Temporary until authentication is implemented
                    include: [{
                            model: models_1.HabitEntry,
                            where: {
                                date: {
                                    [sequelize_1.Op.between]: [startDate, endDate],
                                },
                            },
                            required: false,
                        }],
                });
                return res.json(habits);
            }
            catch (error) {
                console.error('Get habits with entries error:', error);
                return res.status(500).json({ error: 'Failed to fetch habits with entries' });
            }
        });
    }
    toggleHabitEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { habitId } = req.params;
                const { date } = req.body;
                const parsedDate = new Date(date);
                const [entry, created] = yield models_1.HabitEntry.findOrCreate({
                    where: {
                        habitId: parseInt(habitId),
                        userId: 1, // Temporary until authentication is implemented
                        date: parsedDate,
                    },
                    defaults: {
                        habitId: parseInt(habitId),
                        userId: 1, // Temporary until authentication is implemented
                        date: parsedDate,
                        completed: true,
                    },
                });
                if (!created) {
                    yield entry.update({ completed: !entry.get('completed') });
                }
                return res.json(entry);
            }
            catch (error) {
                console.error('Toggle habit entry error:', error);
                return res.status(500).json({ error: 'Failed to toggle habit entry' });
            }
        });
    }
    getHabitStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { habitId } = req.params;
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const entries = yield models_1.HabitEntry.findAll({
                    where: {
                        habitId: parseInt(habitId),
                        userId: 1, // Temporary until authentication is implemented
                        date: {
                            [sequelize_1.Op.gte]: thirtyDaysAgo,
                        },
                    },
                    order: [['date', 'ASC']],
                });
                const stats = {
                    totalEntries: entries.length,
                    completedEntries: entries.filter(entry => entry.get('completed')).length,
                    completionRate: 0,
                    streak: 0,
                };
                stats.completionRate = (stats.completedEntries / stats.totalEntries) * 100;
                // Calculate current streak
                let streak = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                for (let i = entries.length - 1; i >= 0; i--) {
                    const entry = entries[i];
                    const entryDate = new Date(entry.get('date'));
                    entryDate.setHours(0, 0, 0, 0);
                    if (entry.get('completed') &&
                        (i === entries.length - 1 ||
                            entryDate.getTime() === today.getTime() - streak * 24 * 60 * 60 * 1000)) {
                        streak++;
                    }
                    else {
                        break;
                    }
                }
                stats.streak = streak;
                return res.json(stats);
            }
            catch (error) {
                console.error('Get habit stats error:', error);
                return res.status(500).json({ error: 'Failed to fetch habit statistics' });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const habits = yield models_1.Habit.findAll({
                    where: {
                        userId: 1, // Temporary until authentication is implemented
                    },
                    include: [{
                            model: HabitLog_1.default,
                            as: 'logs',
                            limit: 14, // Get last 14 days of logs
                            order: [['completedAt', 'DESC']],
                        }],
                    order: [['createdAt', 'DESC']],
                });
                return res.json(habits);
            }
            catch (error) {
                console.error('Get all error:', error);
                return res.status(500).json({ error: 'Failed to fetch habits' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const habit = yield models_1.Habit.create(Object.assign(Object.assign({}, req.body), { userId: 1 }));
                return res.json(habit);
            }
            catch (error) {
                console.error('Create error:', error);
                return res.status(500).json({ error: 'Failed to create habit' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const habit = yield models_1.Habit.findOne({
                    where: {
                        id: req.params.id,
                        userId: 1, // Temporary until authentication is implemented
                    },
                });
                if (!habit) {
                    return res.status(404).json({ error: 'Habit not found' });
                }
                yield habit.update(req.body);
                return res.json(habit);
            }
            catch (error) {
                console.error('Update error:', error);
                return res.status(500).json({ error: 'Failed to update habit' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const habit = yield models_1.Habit.findOne({
                    where: {
                        id: req.params.id,
                        userId: 1, // Temporary until authentication is implemented
                    },
                });
                if (!habit) {
                    return res.status(404).json({ error: 'Habit not found' });
                }
                yield habit.destroy();
                return res.json({ success: true });
            }
            catch (error) {
                console.error('Delete error:', error);
                return res.status(500).json({ error: 'Failed to delete habit' });
            }
        });
    }
    logHabit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { habitId } = req.params;
                const { note, completedAt } = req.body;
                const habit = yield models_1.Habit.findOne({
                    where: {
                        id: habitId,
                        userId: 1, // Temporary until authentication is implemented
                    },
                });
                if (!habit) {
                    return res.status(404).json({ error: 'Habit not found' });
                }
                const log = yield HabitLog_1.default.create({
                    habitId: parseInt(habitId),
                    completedAt: completedAt || new Date(),
                    note,
                });
                // Update streak
                const recentLogs = yield HabitLog_1.default.findAll({
                    where: {
                        habitId,
                        completedAt: {
                            [sequelize_1.Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
                        },
                    },
                    order: [['completedAt', 'DESC']],
                });
                let currentStreak = 0;
                for (let i = 0; i < recentLogs.length; i++) {
                    if (i === 0 ||
                        new Date(recentLogs[i].completedAt).toDateString() ===
                            new Date(new Date().setDate(new Date().getDate() - i)).toDateString()) {
                        currentStreak++;
                    }
                    else {
                        break;
                    }
                }
                yield habit.update({
                    currentStreak,
                    longestStreak: Math.max(currentStreak, habit.longestStreak || 0),
                });
                return res.status(201).json(log);
            }
            catch (error) {
                console.error('Error logging habit:', error);
                return res.status(500).json({ error: 'Failed to log habit' });
            }
        });
    }
    getHabitLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const { id } = req.params;
                if (!startDate || !endDate) {
                    return res.status(400).json({ error: 'Start date and end date are required' });
                }
                const logs = yield HabitLog_1.default.findAll({
                    where: {
                        habitId: id,
                        completedAt: {
                            [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)],
                        },
                    },
                    order: [['completedAt', 'DESC']],
                });
                return res.json(logs);
            }
            catch (error) {
                console.error('Error fetching habit logs:', error);
                return res.status(500).json({ error: 'Failed to fetch habit logs' });
            }
        });
    }
}
exports.default = new HabitController();
