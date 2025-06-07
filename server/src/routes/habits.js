"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HabitController_1 = __importDefault(require("../controllers/HabitController"));
const router = express_1.default.Router();
// Get all habits with recent logs
router.get('/', HabitController_1.default.getAll.bind(HabitController_1.default));
// Create a new habit
router.post('/', HabitController_1.default.create.bind(HabitController_1.default));
// Update a habit
router.put('/:id', HabitController_1.default.update.bind(HabitController_1.default));
// Delete a habit
router.delete('/:id', HabitController_1.default.delete.bind(HabitController_1.default));
// Log habit completion
router.post('/:id/log', HabitController_1.default.logHabit.bind(HabitController_1.default));
// Get habit logs for a date range
router.get('/:id/logs', HabitController_1.default.getHabitLogs.bind(HabitController_1.default));
// Get habit statistics
router.get('/:id/stats', HabitController_1.default.getHabitStats.bind(HabitController_1.default));
exports.default = router;
