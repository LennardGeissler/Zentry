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
exports.DailyMood = exports.HabitEntry = exports.DailyTask = exports.YearlyGoal = exports.HabitLog = exports.Habit = exports.Task = exports.sequelize = void 0;
exports.testConnection = testConnection;
exports.syncDatabase = syncDatabase;
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
const Task_1 = __importDefault(require("./Task"));
exports.Task = Task_1.default;
const Habit_1 = __importDefault(require("./Habit"));
exports.Habit = Habit_1.default;
const HabitLog_1 = __importDefault(require("./HabitLog"));
exports.HabitLog = HabitLog_1.default;
const YearlyGoal_1 = __importDefault(require("./YearlyGoal"));
exports.YearlyGoal = YearlyGoal_1.default;
const DailyTask_1 = __importDefault(require("./DailyTask"));
exports.DailyTask = DailyTask_1.default;
const HabitEntry_1 = __importDefault(require("./HabitEntry"));
exports.HabitEntry = HabitEntry_1.default;
const DailyMood_1 = __importDefault(require("./DailyMood"));
exports.DailyMood = DailyMood_1.default;
// Initialize models
const models = {
    Task: Task_1.default,
    Habit: Habit_1.default,
    HabitLog: HabitLog_1.default,
    YearlyGoal: YearlyGoal_1.default,
    DailyTask: DailyTask_1.default,
    HabitEntry: HabitEntry_1.default,
    DailyMood: DailyMood_1.default,
};
// Test database connection
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.authenticate();
            console.log('Database connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
}
// Sync all models with the database
function syncDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.sync();
            console.log('Database synchronized successfully.');
        }
        catch (error) {
            console.error('Error synchronizing database:', error);
        }
    });
}
exports.default = models;
