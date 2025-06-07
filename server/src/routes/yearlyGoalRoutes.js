"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const YearlyGoalController_1 = __importDefault(require("../controllers/YearlyGoalController"));
const router = (0, express_1.Router)();
router.get('/', YearlyGoalController_1.default.getAll.bind(YearlyGoalController_1.default));
router.get('/:id', YearlyGoalController_1.default.getById.bind(YearlyGoalController_1.default));
router.post('/', YearlyGoalController_1.default.create.bind(YearlyGoalController_1.default));
router.put('/:id', YearlyGoalController_1.default.update.bind(YearlyGoalController_1.default));
router.delete('/:id', YearlyGoalController_1.default.delete.bind(YearlyGoalController_1.default));
exports.default = router;
