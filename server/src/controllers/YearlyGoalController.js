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
class YearlyGoalController extends BaseController_1.default {
    constructor() {
        super(models_1.YearlyGoal);
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const goals = yield models_1.YearlyGoal.findAll({
                    where: {
                        userId: 1, // Temporary until authentication is implemented
                    },
                    order: [['createdAt', 'DESC']],
                });
                return res.json(goals);
            }
            catch (error) {
                console.error('Get all error:', error);
                return res.status(500).json({ error: 'Failed to fetch goals' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const goal = yield models_1.YearlyGoal.create(Object.assign(Object.assign({}, req.body), { userId: 1 }));
                return res.json(goal);
            }
            catch (error) {
                console.error('Create error:', error);
                return res.status(500).json({ error: 'Failed to create goal' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const goal = yield models_1.YearlyGoal.findOne({
                    where: {
                        id: req.params.id,
                        userId: 1, // Temporary until authentication is implemented
                    },
                });
                if (!goal) {
                    return res.status(404).json({ error: 'Goal not found' });
                }
                yield goal.update(req.body);
                return res.json(goal);
            }
            catch (error) {
                console.error('Update error:', error);
                return res.status(500).json({ error: 'Failed to update goal' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const goal = yield models_1.YearlyGoal.findOne({
                    where: {
                        id: req.params.id,
                        userId: 1, // Temporary until authentication is implemented
                    },
                });
                if (!goal) {
                    return res.status(404).json({ error: 'Goal not found' });
                }
                yield goal.destroy();
                return res.json({ success: true });
            }
            catch (error) {
                console.error('Delete error:', error);
                return res.status(500).json({ error: 'Failed to delete goal' });
            }
        });
    }
}
exports.default = new YearlyGoalController();
