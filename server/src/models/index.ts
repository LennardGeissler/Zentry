import sequelize from '../config/database';
import Task from './Task';
import Habit from './Habit';
import HabitLog from './HabitLog';
import YearlyGoal from './YearlyGoal';
import DailyTask from './DailyTask';
import HabitEntry from './HabitEntry';
import DailyMood from './DailyMood';

// Initialize models
const models = {
  Task,
  Habit,
  HabitLog,
  YearlyGoal,
  DailyTask,
  HabitEntry,
  DailyMood,
};

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Sync all models with the database
async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

export { sequelize, testConnection, syncDatabase };
export { Task, Habit, HabitLog, YearlyGoal, DailyTask, HabitEntry, DailyMood };
export default models; 