import type { Habit, HabitLog, Task } from '../types';
import { api } from './api/authService';

console.log('API Host:', import.meta.env.VITE_API_HOST);
console.log('API Port:', import.meta.env.VITE_API_PORT);
const BASE_URL = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;
console.log('Final BASE_URL:', BASE_URL);

export const habitService = {
  // Get all habits with recent logs
  getHabits: async () => {
    const response = await api.get<Habit[]>(`${BASE_URL}/api/habits`);
    return response.data;
  },

  // Create a new habit
  createHabit: async (habit: { name: string, description?: string, frequency?: string, targetDays?: number }) => {
    const response = await api.post<Habit>(`${BASE_URL}/api/habits`, habit);
    return response.data;
  },

  // Update a habit
  updateHabit: async (habitId: number, updates: Partial<Habit>) => {
    const response = await api.put<Habit>(`${BASE_URL}/api/habits/${habitId}`, updates);
    return response.data;
  },

  // Delete a habit
  deleteHabit: async (habitId: number) => {
    await api.delete(`${BASE_URL}/api/habits/${habitId}`);
  },

  // Log habit completion
  logHabit: async (habitId: number, data: { note?: string, completedAt?: Date }) => {
    const response = await api.post<HabitLog>(`${BASE_URL}/api/habits/${habitId}/log`, data);
    return response.data;
  },

  // Get habit logs for a date range
  getHabitLogs: async (habitId: number, startDate: Date, endDate: Date) => {
    const response = await api.get<HabitLog[]>(`${BASE_URL}/api/habits/${habitId}/logs`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  },
};

export const taskService = {
  // Get all daily tasks
  getDailyTasks: async () => {
    const response = await api.get<Task[]>(`${BASE_URL}/api/tasks/daily`);
    return response.data;
  },

  // Create a new task
  createTask: async (task: { text: string, topic: string }) => {
    const response = await api.post<Task>(`${BASE_URL}/api/tasks`, task);
    return response.data;
  },

  // Update a task
  updateTask: async (taskId: number, updates: { completed?: boolean, text?: string, topic?: string }) => {
    const response = await api.put<Task>(`${BASE_URL}/api/tasks/${taskId}`, updates);
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId: number) => {
    await api.delete(`${BASE_URL}/api/tasks/${taskId}`);
  },
};

export const dailyMoodService = {
  // Get mood for a specific date
  getMoodByDate: async (date?: Date) => {
    const response = await api.get(`${BASE_URL}/api/daily-moods/by-date`, {
      params: { date: date?.toISOString() },
    });
    return response.data;
  },

  // Save mood for today
  saveMood: async (mood: { happy: boolean; productive: boolean; stressed: boolean; tired: boolean }) => {
    const response = await api.post(`${BASE_URL}/api/daily-moods`, {
      ...mood,
      date: new Date(),
    });
    return response.data;
  },

  // Get mood statistics
  getMoodStats: async () => {
    const response = await api.get(`${BASE_URL}/api/daily-moods/stats`);
    return response.data;
  },
};

export const yearlyGoalService = {
  // Get all yearly goals
  getYearlyGoals: async () => {
    const response = await api.get(`${BASE_URL}/api/yearly-goals`);
    return response.data;
  },

  // Create a new yearly goal
  createYearlyGoal: async (goal: { text: string; topic: string }) => {
    const response = await api.post(`${BASE_URL}/api/yearly-goals`, goal);
    return response.data;
  },

  // Update a yearly goal
  updateYearlyGoal: async (goalId: number, updates: { completed?: boolean; text?: string; topic?: string }) => {
    const response = await api.put(`${BASE_URL}/api/yearly-goals/${goalId}`, updates);
    return response.data;
  },

  // Delete a yearly goal
  deleteYearlyGoal: async (goalId: number) => {
    await api.delete(`${BASE_URL}/api/yearly-goals/${goalId}`);
  },
};