"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HabitController_1 = __importDefault(require("../controllers/HabitController"));
const router = (0, express_1.Router)();
router.get('/', HabitController_1.default.getAll.bind(HabitController_1.default));
router.get('/:id', HabitController_1.default.getById.bind(HabitController_1.default));
router.get('/:habitId/stats', HabitController_1.default.getHabitStats.bind(HabitController_1.default));
router.get('/:habitId/logs', HabitController_1.default.getHabitLogs.bind(HabitController_1.default));
router.post('/', HabitController_1.default.create.bind(HabitController_1.default));
router.post('/:habitId/log', HabitController_1.default.logHabit.bind(HabitController_1.default));
router.put('/:id', HabitController_1.default.update.bind(HabitController_1.default));
router.delete('/:id', HabitController_1.default.delete.bind(HabitController_1.default));
exports.default = router;
