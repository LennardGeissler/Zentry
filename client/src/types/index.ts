export interface Task {
  id: number;
  text: string;
  completed: boolean;
  topic: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
  logs?: { completedAt: Date }[];
}

export interface HabitLog {
  id: number;
  habitId: number;
  completedAt: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Statistics {
  tasks: {
    total: number;
    completed: number;
    completion_rate: number;
    overdue: number;
  };
  habits: {
    total: number;
    active: number;
    averageStreak: number;
    bestPerforming: string;
  };
  timeframes: {
    daily: TaskStats;
    weekly: TaskStats;
    monthly: TaskStats;
    yearly: TaskStats;
  };
}

export interface TaskStats {
  completed: number;
  total: number;
  rate: number;
}

export type TaskTopic = 'University' | 'Job' | 'Fitness' | 'Appointments' | 'Others';

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  allDay?: boolean;
} 