"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DailyTaskController_1 = __importDefault(require("../controllers/DailyTaskController"));
const router = (0, express_1.Router)();
router.get('/', DailyTaskController_1.default.getAll.bind(DailyTaskController_1.default));
router.get('/by-date', DailyTaskController_1.default.getTasksByDate.bind(DailyTaskController_1.default));
router.get('/:id', DailyTaskController_1.default.getById.bind(DailyTaskController_1.default));
router.post('/', DailyTaskController_1.default.create.bind(DailyTaskController_1.default));
router.put('/:id', DailyTaskController_1.default.update.bind(DailyTaskController_1.default));
router.delete('/:id', DailyTaskController_1.default.delete.bind(DailyTaskController_1.default));
exports.default = router;
