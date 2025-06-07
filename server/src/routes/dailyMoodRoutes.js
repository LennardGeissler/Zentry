"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DailyMoodController_1 = __importDefault(require("../controllers/DailyMoodController"));
const router = (0, express_1.Router)();
router.get('/', DailyMoodController_1.default.getAll.bind(DailyMoodController_1.default));
router.get('/by-date', DailyMoodController_1.default.getMoodByDate.bind(DailyMoodController_1.default));
router.get('/stats', DailyMoodController_1.default.getMoodStats.bind(DailyMoodController_1.default));
router.get('/:id', DailyMoodController_1.default.getById.bind(DailyMoodController_1.default));
router.post('/', DailyMoodController_1.default.create.bind(DailyMoodController_1.default));
router.put('/:id', DailyMoodController_1.default.update.bind(DailyMoodController_1.default));
router.delete('/:id', DailyMoodController_1.default.delete.bind(DailyMoodController_1.default));
exports.default = router;
