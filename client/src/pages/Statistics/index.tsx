import { Grid, Card, Text, Stack } from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const mockTaskData = [
  { name: 'Mon', completed: 4, total: 6 },
  { name: 'Tue', completed: 3, total: 5 },
  { name: 'Wed', completed: 5, total: 7 },
  { name: 'Thu', completed: 2, total: 4 },
  { name: 'Fri', completed: 6, total: 8 },
  { name: 'Sat', completed: 3, total: 5 },
  { name: 'Sun', completed: 4, total: 6 },
];

const mockHabitData = [
  { name: 'Exercise', streak: 5, target: 7 },
  { name: 'Reading', streak: 3, target: 5 },
  { name: 'Meditation', streak: 7, target: 7 },
  { name: 'Journaling', streak: 4, target: 5 },
];

const mockCompletionTrend = [
  { date: 'Week 1', rate: 65 },
  { date: 'Week 2', rate: 72 },
  { date: 'Week 3', rate: 68 },
  { date: 'Week 4', rate: 80 },
];

export default function Statistics() {
  return (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={6}>
          <Card shadow="sm" p="lg" radius="md" withBorder h={400}>
            <Text size="xl" fw={700} mb="md">Weekly Task Overview</Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockTaskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card shadow="sm" p="lg" radius="md" withBorder h={400}>
            <Text size="xl" fw={700} mb="md">Habit Streaks</Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockHabitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="streak" fill="#82ca9d" name="Current Streak" />
                <Bar dataKey="target" fill="#8884d8" name="Target Days" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Text size="xl" fw={700} mb="md">Task Completion Trend</Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#8884d8"
                  name="Completion Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
} 