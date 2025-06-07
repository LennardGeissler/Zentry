"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const yearlyGoalRoutes_1 = __importDefault(require("./yearlyGoalRoutes"));
const tasks_1 = __importDefault(require("./tasks"));
const habitRoutes_1 = __importDefault(require("./habitRoutes"));
const dailyMoodRoutes_1 = __importDefault(require("./dailyMoodRoutes"));
const calendarEventRoutes_1 = __importDefault(require("./calendarEventRoutes"));
const router = (0, express_1.Router)();
router.use('/yearly-goals', yearlyGoalRoutes_1.default);
router.use('/tasks', tasks_1.default);
router.use('/habits', habitRoutes_1.default);
router.use('/daily-moods', dailyMoodRoutes_1.default);
router.use('/calendar-events', calendarEventRoutes_1.default);
exports.default = router;
