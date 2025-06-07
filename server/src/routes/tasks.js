"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const router = express_1.default.Router();
// Get all daily tasks
router.get('/daily', taskController_1.taskController.getDailyTasks);
// Create a new task
router.post('/', taskController_1.taskController.createTask);
// Update a task
router.put('/:id', taskController_1.taskController.updateTask);
// Delete a task
router.delete('/:id', taskController_1.taskController.deleteTask);
exports.default = router;
