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
class DailyTaskController extends BaseController_1.default {
    constructor() {
        super(models_1.DailyTask);
    }
    getTasksByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const date = req.query.date ? new Date(req.query.date) : new Date();
                const startOfDay = new Date(date.setHours(0, 0, 0, 0));
                const endOfDay = new Date(date.setHours(23, 59, 59, 999));
                const tasks = yield models_1.DailyTask.findAll({
                    where: {
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                        dueDate: {
                            [sequelize_1.Op.between]: [startOfDay, endOfDay],
                        },
                    },
                    order: [['priority', 'DESC']],
                });
                return res.json(tasks);
            }
            catch (error) {
                console.error('Get tasks by date error:', error);
                return res.status(500).json({ error: 'Failed to fetch tasks' });
            }
        });
    }
}
exports.default = new DailyTaskController();
