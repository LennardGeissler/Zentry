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
class DailyMoodController extends BaseController_1.default {
    constructor() {
        super(models_1.DailyMood);
    }
    getMoodByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.query.date ? new Date(req.query.date) : new Date();
                const startOfDay = new Date(date.setHours(0, 0, 0, 0));
                const endOfDay = new Date(date.setHours(23, 59, 59, 999));
                const mood = yield models_1.DailyMood.findOne({
                    where: {
                        userId: 1, // Temporary until authentication is implemented
                        date: {
                            [sequelize_1.Op.between]: [startOfDay, endOfDay],
                        },
                    },
                });
                return res.json(mood || {
                    happy: false,
                    productive: false,
                    stressed: false,
                    tired: false,
                });
            }
            catch (error) {
                console.error('Get mood by date error:', error);
                return res.status(500).json({ error: 'Failed to fetch mood' });
            }
        });
    }
    getMoodStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const moods = yield models_1.DailyMood.findAll({
                    where: {
                        userId: 1, // Temporary until authentication is implemented
                        date: {
                            [sequelize_1.Op.gte]: thirtyDaysAgo,
                        },
                    },
                    order: [['date', 'ASC']],
                });
                const stats = {
                    totalDays: moods.length,
                    happyDays: moods.filter(mood => mood.get('happy')).length,
                    productiveDays: moods.filter(mood => mood.get('productive')).length,
                    stressedDays: moods.filter(mood => mood.get('stressed')).length,
                    tiredDays: moods.filter(mood => mood.get('tired')).length,
                };
                return res.json(stats);
            }
            catch (error) {
                console.error('Get mood stats error:', error);
                return res.status(500).json({ error: 'Failed to fetch mood statistics' });
            }
        });
    }
    // Override the create method to handle upsert for daily moods
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = new Date(req.body.date);
                const startOfDay = new Date(date.setHours(0, 0, 0, 0));
                // Try to find an existing mood for this date
                const existingMood = yield this.model.findOne({
                    where: {
                        userId: 1, // Temporary until authentication is implemented
                        date: startOfDay,
                    },
                });
                let mood;
                if (existingMood) {
                    // Update existing mood
                    mood = yield existingMood.update({
                        happy: req.body.happy,
                        productive: req.body.productive,
                        stressed: req.body.stressed,
                        tired: req.body.tired,
                    });
                }
                else {
                    // Create new mood
                    mood = yield this.model.create(Object.assign(Object.assign({}, req.body), { userId: 1, date: startOfDay }));
                }
                return res.status(201).json(mood);
            }
            catch (error) {
                console.error('Create/Update mood error:', error);
                return res.status(500).json({ error: 'Failed to save mood' });
            }
        });
    }
}
exports.default = new DailyMoodController();
