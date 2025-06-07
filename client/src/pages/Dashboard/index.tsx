import { useState, useEffect, useMemo } from 'react';
import { Select, Checkbox, Text, ActionIcon, Tooltip as MantineTooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  IconTrash, 
  IconEdit, 
  IconMoodSmile, 
  IconBarbell, 
  IconAlertTriangle, 
  IconMoonStars,
  IconBook2,
  IconBrain,
  IconBottle,
  IconPill,
  IconYoga,
  IconSun,
  IconNotes,
  IconDeviceLaptop,
  IconPhone,
  IconClock,
  IconApple,
  IconZzz,
  IconHeartbeat,
  IconRun
} from '@tabler/icons-react';
import styles from './Dashboard.module.scss';
import { taskService, dailyMoodService, habitService, yearlyGoalService } from '../../services/api';
import type { Task, Habit } from '../../types';
import React from 'react';

type GoalTopic = 'Career' | 'Education' | 'Health' | 'Personal' | 'Finance';

interface YearlyGoal {
  id: number;
  text: string;
  completed: boolean;
  topic: GoalTopic;
}

type TaskTopic = 'University' | 'Job' | 'Fitness' | 'Appointments' | 'Others';

interface HabitEntry {
  date: Date;
  weekday: string;
  habits: { id: number; completed: boolean }[];
  progress: number;
}

interface DailyMood {
  happy: boolean;
  productive: boolean;
  stressed: boolean;
  tired: boolean;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const COLORS = {
  completed: 'var(--mantine-color-green-filled)',
  uncompleted: 'var(--mantine-color-red-filled)',
};

const getHabitIcon = (habitName: string) => {
  const normalizedName = habitName.toLowerCase();
  
  if (normalizedName.includes('exercise') || normalizedName.includes('workout')) return IconBarbell;
  if (normalizedName.includes('read')) return IconBook2;
  if (normalizedName.includes('meditat')) return IconBrain;
  if (normalizedName.includes('water')) return IconBottle;
  if (normalizedName.includes('medicine') || normalizedName.includes('vitamin')) return IconPill;
  if (normalizedName.includes('yoga') || normalizedName.includes('stretch')) return IconYoga;
  if (normalizedName.includes('morning')) return IconSun;
  if (normalizedName.includes('journal') || normalizedName.includes('write')) return IconNotes;
  if (normalizedName.includes('study') || normalizedName.includes('work')) return IconDeviceLaptop;
  if (normalizedName.includes('screen') || normalizedName.includes('phone')) return IconPhone;
  if (normalizedName.includes('time') || normalizedName.includes('schedule')) return IconClock;
  if (normalizedName.includes('eat') || normalizedName.includes('diet')) return IconApple;
  if (normalizedName.includes('sleep')) return IconZzz;
  if (normalizedName.includes('health')) return IconHeartbeat;
  if (normalizedName.includes('run') || normalizedName.includes('walk')) return IconRun;
  
  // Default icon if no match
  return IconBarbell;
};

const getWeekdayAbbreviation = (weekday: string) => {
  return weekday.slice(0, 3);
};

export default function Dashboard() {
  const [yearlyGoals, setYearlyGoals] = useState<YearlyGoal[]>([]);
  const [editingGoal, setEditingGoal] = useState<YearlyGoal | null>(null);

  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [newGoal, setNewGoal] = useState('');
  const [newGoalTopic, setNewGoalTopic] = useState<GoalTopic>('Personal');
  const [newTask, setNewTask] = useState('');
  const [newTaskTopic, setNewTaskTopic] = useState<TaskTopic>('Others');

  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);

  const [priority, setPriority] = useState<string>('medium');
  const [dailyMood, setDailyMood] = useState<DailyMood>({
    happy: false,
    productive: false,
    stressed: false,
    tired: false,
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadDailyTasks();
    loadTodayMood();
    loadHabits();
    loadYearlyGoals();
  }, []);

  const loadYearlyGoals = async () => {
    try {
      const goals = await yearlyGoalService.getYearlyGoals();
      setYearlyGoals(goals);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load yearly goals',
        color: 'red',
      });
    }
  };

  const loadHabits = async () => {
    try {
      const habits = await habitService.getHabits();
      setHabits(habits);

      // Generate entries for the last 14 days
      const today = new Date();
      const entries: HabitEntry[] = [];

      for (let i = 0; i <= 13; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekday = weekdays[date.getDay()];

        // Check if each habit was completed on this date
        const habitStates = habits.map(habit => {
          const log = habit.logs?.find(log =>
            new Date(log.completedAt).toDateString() === date.toDateString()
          );
          return { id: habit.id, completed: !!log };
        });

        const progress = Math.round((habitStates.filter(h => h.completed).length / habits.length) * 100);

        entries.push({
          date,
          weekday,
          habits: habitStates,
          progress,
        });
      }

      setHabitEntries(entries);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load habits',
        color: 'red',
      });
    }
  };

  const loadDailyTasks = async () => {
    try {
      const tasks = await taskService.getDailyTasks();
      setDailyTasks(tasks);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load daily tasks',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTodayMood = async () => {
    try {
      const mood = await dailyMoodService.getMoodByDate();
      if (mood) {
        setDailyMood(mood);
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load daily mood',
        color: 'red',
      });
    }
  };

  const toggleGoal = async (id: number) => {
    try {
      const goal = yearlyGoals.find(g => g.id === id);
      if (!goal) return;

      await yearlyGoalService.updateYearlyGoal(id, { completed: !goal.completed });
      setYearlyGoals(goals =>
        goals.map(goal =>
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        )
      );
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update goal',
        color: 'red',
      });
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const task = dailyTasks.find(t => t.id === id);
      if (!task) return;

      await taskService.updateTask(id, { completed: !task.completed });
      setDailyTasks(tasks =>
        tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update task',
        color: 'red',
      });
    }
  };

  const toggleHabit = async (entryIndex: number, habitIndex: number) => {
    try {
      const entry = habitEntries[entryIndex];
      const habitState = entry.habits[habitIndex];
      const habit = habits[habitIndex];

      if (!habit) return;

      // If the habit was not completed, log it
      if (!habitState.completed) {
        await habitService.logHabit(habit.id, {
          completedAt: entry.date,
        });
      } else {
        // TODO: Implement habit log deletion if needed
      }

      // Update the UI
      setHabitEntries(entries => {
        const newEntries = [...entries];
        const entry = { ...newEntries[entryIndex] };
        const newHabits = [...entry.habits];
        newHabits[habitIndex] = { ...newHabits[habitIndex], completed: !habitState.completed };
        entry.habits = newHabits;
        entry.progress = Math.round((newHabits.filter(h => h.completed).length / habits.length) * 100);
        newEntries[entryIndex] = entry;
        return newEntries;
      });

      // Reload habits to get updated streaks
      loadHabits();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update habit',
        color: 'red',
      });
    }
  };

  const addNewGoal = async () => {
    if (!newGoal.trim()) return;

    try {
      const goal = await yearlyGoalService.createYearlyGoal({
        text: newGoal.trim(),
        topic: newGoalTopic,
      });

      setYearlyGoals(goals => [...goals, goal]);
      setNewGoal('');

      notifications.show({
        title: 'Success',
        message: 'Goal created successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create goal',
        color: 'red',
      });
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      await yearlyGoalService.deleteYearlyGoal(id);
      setYearlyGoals(goals => goals.filter(goal => goal.id !== id));

      notifications.show({
        title: 'Success',
        message: 'Goal deleted successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete goal',
        color: 'red',
      });
    }
  };

  const updateGoal = async (id: number, updates: { text?: string; topic?: string }) => {
    try {
      const updatedGoal = await yearlyGoalService.updateYearlyGoal(id, updates);
      setYearlyGoals(goals =>
        goals.map(goal =>
          goal.id === id ? updatedGoal : goal
        )
      );
      setEditingGoal(null);

      notifications.show({
        title: 'Success',
        message: 'Goal updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update goal',
        color: 'red',
      });
    }
  };

  const addNewTask = async () => {
    if (!newTask.trim()) return;

    try {
      const task = await taskService.createTask({
        text: newTask.trim(),
        topic: newTaskTopic,
      });

      setDailyTasks(tasks => [...tasks, task]);
      setNewTask('');

      notifications.show({
        title: 'Success',
        message: 'Task created successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create task',
        color: 'red',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'goal' | 'task') => {
    if (e.key === 'Enter') {
      if (type === 'goal') {
        addNewGoal();
      } else {
        addNewTask();
      }
    }
  };

  const chartData = useMemo(() => {
    return [...habitEntries]
      .reverse()
      .map(entry => ({
        date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        progress: entry.progress,
        habits: entry.habits.filter(Boolean).length,
        completed: entry.habits.filter(h => h.completed).length,
        total: entry.habits.length,
      }));
  }, [habitEntries]);

  const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (!active || !payload || !payload[0]) {
      return null;
    }

    const data = payload[0].payload;
    return (
      <div className={styles['chart-tooltip']}>
        <p className={styles['chart-tooltip__date']}>{label}</p>
        <p className={styles['chart-tooltip__progress']}>
          Progress: {data.progress}%
        </p>
        <p className={styles['chart-tooltip__habits']}>
          Completed: {data.completed}/{data.total} habits
        </p>
      </div>
    );
  };

  const todayStats = useMemo(() => {
    const completed = dailyTasks.filter(task => task.completed).length;
    const uncompleted = dailyTasks.length - completed;
    const completionRate = dailyTasks.length > 0
      ? Math.round((completed / dailyTasks.length) * 100)
      : 0;

    return {
      completed,
      uncompleted,
      total: dailyTasks.length,
      completionRate,
    };
  }, [dailyTasks]);

  const todayChartData = [
    { name: 'Completed', value: todayStats.completed },
    { name: 'Uncompleted', value: todayStats.uncompleted },
  ];

  const CustomLabel = ({ cx, cy }: { cx: number, cy: number }) => {
    return (
      <g>
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          dominantBaseline="central"
          className={styles['chart-label__percentage']}
        >
          {todayStats.completionRate}%
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="central"
          className={styles['chart-label__tasks']}
        >
          {todayStats.completed} of {todayStats.total} tasks
        </text>
      </g>
    );
  };

  const handleMoodChange = async (mood: keyof DailyMood) => {
    const newMood = {
      ...dailyMood,
      [mood]: !dailyMood[mood]
    };
    setDailyMood(newMood);

    try {
      await dailyMoodService.saveMood(newMood);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save mood',
        color: 'red',
      });
      // Revert the change if save failed
      setDailyMood(dailyMood);
    }
  };

  const updateTask = async (id: number, updates: { text?: string; topic?: string }) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setDailyTasks(tasks =>
        tasks.map(task =>
          task.id === id ? updatedTask : task
        )
      );
      setEditingTask(null);

      notifications.show({
        title: 'Success',
        message: 'Task updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update task',
        color: 'red',
      });
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setDailyTasks(tasks => tasks.filter(task => task.id !== id));

      notifications.show({
        title: 'Success',
        message: 'Task deleted successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete task',
        color: 'red',
      });
    }
  };

  if (loading) {
    return <></>
  }

  return (
    <div className={styles.dashboard}>
      <section className={`${styles.dashboard__section} ${styles['dashboard__section--today-overview']}`}>
        <h2>Today Overview</h2>
        <div className={styles['today-overview']}>
          <div className={styles['today-overview__content']}>
            <div className={styles['today-overview__chart']}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={todayChartData}
                    cx="50%"
                    cy="42%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={CustomLabel}
                  >
                    {todayChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? COLORS.completed : COLORS.uncompleted}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles['today-overview__info']}>
              <div className={styles['today-overview__priority']}>
                <Text size="sm" c="dimmed" mb={5}>Priority</Text>
                <Select
                  value={priority}
                  onChange={(value) => setPriority(value || 'medium')}
                  data={[
                    { value: 'high', label: 'High' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'low', label: 'Low' },
                  ]}
                  size="sm"
                />
              </div>
              <div className={styles['today-overview__mood']}>
                <Text size="sm" c="dimmed" mb={5}>Mood</Text>
                <div className={styles['mood-grid']}>
                  <div className={styles['mood-grid__item']}>
                    <IconMoodSmile size={20} stroke={1.5} />
                    <Checkbox
                      checked={dailyMood.happy}
                      onChange={() => handleMoodChange('happy')}
                      styles={{ input: { cursor: 'pointer' } }}
                    />
                  </div>
                  <div className={styles['mood-grid__item']}>
                    <IconBarbell size={20} stroke={1.5} />
                    <Checkbox
                      checked={dailyMood.productive}
                      onChange={() => handleMoodChange('productive')}
                      styles={{ input: { cursor: 'pointer' } }}
                    />
                  </div>
                  <div className={styles['mood-grid__item']}>
                    <IconAlertTriangle size={20} stroke={1.5} />
                    <Checkbox
                      checked={dailyMood.stressed}
                      onChange={() => handleMoodChange('stressed')}
                      styles={{ input: { cursor: 'pointer' } }}
                    />
                  </div>
                  <div className={styles['mood-grid__item']}>
                    <IconMoonStars size={20} stroke={1.5} />
                    <Checkbox
                      checked={dailyMood.tired}
                      onChange={() => handleMoodChange('tired')}
                      styles={{ input: { cursor: 'pointer' } }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.dashboard__section} ${styles['dashboard__section--habit-tracker']}`}>
        <h2>Habit Tracker</h2>
        <div className={styles['habit-tracker']}>
          <table className={styles['habit-tracker__table']}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weekday</th>
                {habits.map(habit => (
                  <th key={habit.id}>
                    <span className={styles['habit-name-desktop']}>
                      {habit.name}
                    </span>
                    <span className={styles['habit-name-mobile']}>
                      <MantineTooltip label={habit.name}>
                        {React.createElement(getHabitIcon(habit.name), {
                          size: 20,
                          stroke: 1.5,
                        })}
                      </MantineTooltip>
                    </span>
                  </th>
                ))}
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {habitEntries.map((entry, entryIndex) => (
                <tr key={entry.date.toISOString()}>
                  <td>{entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className={styles[`weekday-${entry.weekday.toLowerCase()}`]}>
                    <span className={styles['weekday-desktop']}>
                      {entry.weekday}
                    </span>
                    <span className={styles['weekday-mobile']}>
                      {getWeekdayAbbreviation(entry.weekday)}
                    </span>
                  </td>
                  {entry.habits.map((habit, habitIndex) => (
                    <td key={habit.id}>
                      <Checkbox
                        checked={habit.completed}
                        onChange={() => toggleHabit(entryIndex, habitIndex)}
                        styles={{
                          input: {
                            cursor: 'pointer',
                            backgroundColor: habit.completed ? 'var(--mantine-color-blue-6)' : 'transparent',
                            border: '2px solid var(--mantine-color-blue-6)',
                            borderRadius: '4px',
                            '&:checked': {
                              backgroundColor: 'var(--mantine-color-blue-6)',
                            },
                          },
                        }}
                      />
                    </td>
                  ))}
                  <td>{entry.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${styles.dashboard__section} ${styles['dashboard__section--yearly-goals']}`}>
        <h2>Yearly Goals</h2>
        <div className={styles['goals-list']}>
          {yearlyGoals.map((goal) => (
            <div key={goal.id} className={`${styles['goals-list__item']} ${styles[`topic-${goal.topic.toLowerCase()}`]}`}>
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
              />
              {editingGoal?.id === goal.id ? (
                <div className={styles['goals-list__item__edit']}>
                  <input
                    type="text"
                    value={editingGoal.text}
                    onChange={(e) => setEditingGoal({ ...editingGoal, text: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateGoal(goal.id, { text: editingGoal.text, topic: editingGoal.topic });
                      }
                    }}
                  />
                  <Select
                    value={editingGoal.topic}
                    onChange={(value) => setEditingGoal({ ...editingGoal, topic: value as GoalTopic })}
                    data={[
                      { value: 'Career', label: 'Career' },
                      { value: 'Education', label: 'Education' },
                      { value: 'Health', label: 'Health' },
                      { value: 'Personal', label: 'Personal' },
                      { value: 'Finance', label: 'Finance' },
                    ]}
                  />
                </div>
              ) : (
                <>
                  <span className={goal.completed ? styles.completed : ''}>
                    {goal.text}
                  </span>
                  <span className={styles['goals-list__item__topic']}>
                    {goal.topic}
                  </span>
                  <div className={styles['goals-list__item__actions']}>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => setEditingGoal(goal)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className={styles['add-goal']}>
          <div className={styles['add-goal__inputs']}>
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'goal')}
              placeholder="Add a new goal..."
            />
            <Select
              value={newGoalTopic}
              onChange={(value) => setNewGoalTopic(value as GoalTopic)}
              data={[
                { value: 'Career', label: 'Career' },
                { value: 'Education', label: 'Education' },
                { value: 'Health', label: 'Health' },
                { value: 'Personal', label: 'Personal' },
                { value: 'Finance', label: 'Finance' },
              ]}
              placeholder="Select topic"
            />
          </div>
        </div>
      </section>

      <section className={`${styles.dashboard__section} ${styles['dashboard__section--daily-tasks']}`}>
        <h2>Daily Tasks</h2>
        <div className={styles['tasks-list']}>
          {dailyTasks.map((task) => (
            <div key={task.id} className={`${styles['tasks-list__item']} ${styles[`topic-${task.topic.toLowerCase()}`]}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              {editingTask?.id === task.id ? (
                <div className={styles['tasks-list__item__edit']}>
                  <input
                    type="text"
                    value={editingTask.text}
                    onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateTask(task.id, { text: editingTask.text, topic: editingTask.topic });
                      }
                    }}
                  />
                  <Select
                    value={editingTask.topic}
                    onChange={(value) => setEditingTask({ ...editingTask, topic: value as TaskTopic })}
                    data={[
                      { value: 'University', label: 'University' },
                      { value: 'Job', label: 'Job' },
                      { value: 'Fitness', label: 'Fitness' },
                      { value: 'Appointments', label: 'Appointments' },
                      { value: 'Others', label: 'Others' },
                    ]}
                  />
                </div>
              ) : (
                <>
                  <span className={task.completed ? styles.completed : ''}>
                    {task.text}
                  </span>
                  <span className={styles['tasks-list__item__topic']}>
                    {task.topic}
                  </span>
                  <div className={styles['tasks-list__item__actions']}>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => setEditingTask(task)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => deleteTask(task.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className={styles['add-task']}>
          <div className={styles['add-task__inputs']}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'task')}
              placeholder="Add a new task..."
            />
            <Select
              value={newTaskTopic}
              onChange={(value) => setNewTaskTopic(value as TaskTopic)}
              data={[
                { value: 'University', label: 'University' },
                { value: 'Job', label: 'Job' },
                { value: 'Fitness', label: 'Fitness' },
                { value: 'Appointments', label: 'Appointments' },
                { value: 'Others', label: 'Others' },
              ]}
              placeholder="Select topic"
            />
          </div>
        </div>
      </section>

      <section className={`${styles.dashboard__section} ${styles['dashboard__section--development-chart']}`}>
        <h2>Development Progress</h2>
        <div className={styles['development-chart']}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-default-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--mantine-color-dimmed)"
                tick={{ fill: 'var(--mantine-color-dimmed)' }}
              />
              <YAxis
                stroke="var(--mantine-color-dimmed)"
                tick={{ fill: 'var(--mantine-color-dimmed)' }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickFormatter={(value) => `${value}%`}
                allowDataOverflow={false}
                scale="linear"
                padding={{ top: 8, bottom: 8 }}
              />
              <Tooltip
                content={(props: ChartTooltipProps) => CustomTooltip(props)}
                cursor={{ stroke: 'var(--mantine-primary-color-filled)' }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="var(--mantine-primary-color-filled)"
                strokeWidth={2}
                dot={{
                  stroke: 'var(--mantine-primary-color-filled)',
                  strokeWidth: 2,
                  r: 3,
                  fill: 'var(--mantine-color-body)'
                }}
                activeDot={{
                  stroke: 'var(--mantine-primary-color-filled)',
                  strokeWidth: 2,
                  r: 4,
                  fill: 'var(--mantine-primary-color-filled)'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}