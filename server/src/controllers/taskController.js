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
exports.taskController = void 0;
const Task_1 = __importDefault(require("../models/Task"));
exports.taskController = {
    // Get all daily tasks
    getDailyTasks: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tasks = yield Task_1.default.findAll({
                where: {
                    userId: 1, // Temporary until authentication is implemented
                },
                order: [['createdAt', 'DESC']],
            });
            res.json(tasks);
        }
        catch (error) {
            console.error('Error fetching daily tasks:', error);
            res.status(500).json({ error: 'Failed to fetch daily tasks' });
        }
    }),
    // Create a new task
    createTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { text, topic } = req.body;
            if (!text || !topic) {
                return res.status(400).json({ error: 'Text and topic are required' });
            }
            const task = yield Task_1.default.create({
                text,
                topic,
                completed: false,
                userId: 1, // Temporary until authentication is implemented
            });
            res.status(201).json(task);
        }
        catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    }),
    // Update a task
    updateTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updates = req.body;
            const task = yield Task_1.default.findOne({
                where: {
                    id,
                    userId: 1, // Temporary until authentication is implemented
                },
            });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            yield task.update(updates);
            res.json(task);
        }
        catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    }),
    // Delete a task
    deleteTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const task = yield Task_1.default.findOne({
                where: {
                    id,
                    userId: 1, // Temporary until authentication is implemented
                },
            });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            yield task.destroy();
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    }),
};
