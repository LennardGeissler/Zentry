import { useState, useEffect } from 'react';
import { Card, Text, Button, TextInput, Select, Stack, Checkbox } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { habitService } from '../../services/api';
import type { Habit } from '../../types';
import styles from './Habits.module.scss';

type HabitFrequency = 'daily' | 'weekly' | 'monthly';

interface NewHabit {
  name: string;
  description: string;
  frequency: HabitFrequency;
  targetDays: number;
}

interface HabitEntry {
  date: Date;
  weekday: string;
  habits: { id: number; completed: boolean }[];
  progress: number;
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState<NewHabit>({
    name: '',
    description: '',
    frequency: 'daily',
    targetDays: 1,
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await habitService.getHabits();
      setHabits(data);

      // Generate entries for the last 14 days
      const today = new Date();
      const entries: HabitEntry[] = [];
      
      for (let i = 0; i <= 13; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekday = weekdays[date.getDay()];
        
        // Check if each habit was completed on this date
        const habitStates = data.map(habit => {
          const log = habit.logs?.find(log => 
            new Date(log.completedAt).toDateString() === date.toDateString()
          );
          return { id: habit.id, completed: !!log };
        });

        const progress = Math.round((habitStates.filter(h => h.completed).length / data.length) * 100);
        
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async () => {
    try {
      const habit = await habitService.createHabit({
        name: newHabit.name,
        description: newHabit.description,
        frequency: newHabit.frequency,
        targetDays: newHabit.targetDays,
      });

      setHabits(prev => [...prev, habit]);
      setNewHabit({
        name: '',
        description: '',
        frequency: 'daily',
        targetDays: 1,
      });

      notifications.show({
        title: 'Success',
        message: 'Habit created successfully',
        color: 'green',
      });

      // Reload habits to update the tracker
      loadHabits();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create habit',
        color: 'red',
      });
    }
  };

  const handleLogHabit = async (habitId: number) => {
    try {
      await habitService.logHabit(habitId, {
        completedAt: new Date(),
      });

      // Refresh habits to get updated streaks
      await loadHabits();

      notifications.show({
        title: 'Success',
        message: 'Habit logged successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to log habit',
        color: 'red',
      });
    }
  };

  const handleDeleteHabit = async (habitId: number) => {
    try {
      await habitService.deleteHabit(habitId);
      setHabits(prev => prev.filter(h => h.id !== habitId));

      notifications.show({
        title: 'Success',
        message: 'Habit deleted successfully',
        color: 'green',
      });

      // Reload habits to update the tracker
      loadHabits();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete habit',
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

  if (loading) return <></>;

  return (
    <div className={styles.habits}>
      <div className={styles.habits__content}>
        <div className={styles['habits__main']}>
          <div className={styles['habits__create']}>
            <Card shadow="sm" p="lg" bg="var(--mantine-color-dark-7)" withBorder>
              <Stack>
                <TextInput
                  label="Name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter habit name"
                  required
                />
                <TextInput
                  label="Description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter habit description"
                />
                <Select
                  label="Frequency"
                  value={newHabit.frequency}
                  onChange={(value: string | null) => {
                    if (value && (value === 'daily' || value === 'weekly' || value === 'monthly')) {
                      setNewHabit(prev => ({ ...prev, frequency: value }));
                    }
                  }}
                  data={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
                <TextInput
                  type="number"
                  label="Target Days"
                  value={newHabit.targetDays.toString()}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, targetDays: parseInt(e.target.value) || 1 }))}
                  min={1}
                />
                <Button onClick={handleCreateHabit}>Create Habit</Button>
              </Stack>
            </Card>
          </div>

          <div className={styles['habits__list']}>
            {habits.map((habit) => (
              <Card key={habit.id} shadow="sm" p="lg" className={styles['habit-card']} bg="var(--mantine-color-dark-7)" withBorder>
                <div className={styles['habit-card__header']}>
                  <Text fw={500} size="lg" mt={4} mb={4}>{habit.name}</Text>
                  <div className={styles['habit-card__actions']}>
                    <Button
                      variant="light"
                      color="blue"
                      onClick={() => handleLogHabit(habit.id)}
                    >
                      Complete
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {habit.description && (
                  <Text c="dimmed" size="sm" mt="sm">
                    {habit.description}
                  </Text>
                )}
                <div className={styles['habit-card__stats']}>
                  <Text size="sm">Frequency: {habit.frequency}</Text>
                  <Text size="sm">Current Streak: {habit.currentStreak}</Text>
                  <Text size="sm">Longest Streak: {habit.longestStreak}</Text>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className={styles['habits__tracker']}>
          <Card shadow="sm" p="lg" bg="var(--mantine-color-dark-7)" withBorder>
            <Text fw={500} size="xl" mb="lg">Habit Tracker</Text>
            <div className={styles['habit-tracker']}>
              <table className={styles['habit-tracker__table']}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weekday</th>
                    {habits.map(habit => (
                      <th key={habit.id}>{habit.name}</th>
                    ))}
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {habitEntries.map((entry, entryIndex) => (
                    <tr key={entry.date.toISOString()}>
                      <td>{entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className={styles[`weekday-${entry.weekday.toLowerCase()}`]}>
                        {entry.weekday}
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
          </Card>
        </div>
      </div>
    </div>
  );
} 