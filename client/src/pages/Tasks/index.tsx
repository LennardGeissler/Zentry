import { useState, useEffect } from 'react';
import { Card, Text, Button, TextInput, Select, Stack, Group, Modal, ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { taskService } from '../../services/api';
import type { Task, TaskTopic } from '../../types';
import styles from './Tasks.module.scss';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    text: '',
    topic: 'Others' as TaskTopic,
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getDailyTasks();
      setTasks(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load tasks',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const task = await taskService.createTask({
        text: newTask.text,
        topic: newTask.topic,
      });

      setTasks(prev => [...prev, task]);
      setNewTask({
        text: '',
        topic: 'Others',
      });

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

  const handleToggleTask = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      await taskService.updateTask(taskId, {
        completed: !task.completed,
      });

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );

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

  const handleEditTask = async () => {
    if (!editingTask) return;

    try {
      const updatedTask = await taskService.updateTask(editingTask.id, {
        text: editingTask.text,
        topic: editingTask.topic,
      });

      setTasks(prev =>
        prev.map(t =>
          t.id === editingTask.id ? updatedTask : t
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

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setDeleteConfirmTask(null);

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

  if (loading) return <></>;

  return (
    <div className={styles.tasks}>
      <div className={styles['tasks__create']}>
        <Card shadow="sm" p="lg">
          <Stack>
            <TextInput
              label="Text"
              value={newTask.text}
              onChange={(e) => setNewTask(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter task text"
              required
            />
            <Select
              label="Topic"
              value={newTask.topic}
              onChange={(value: string | null) => {
                if (value && ['University', 'Job', 'Fitness', 'Appointments', 'Others'].includes(value)) {
                  setNewTask(prev => ({ ...prev, topic: value as TaskTopic }));
                }
              }}
              data={[
                { value: 'University', label: 'University' },
                { value: 'Job', label: 'Job' },
                { value: 'Fitness', label: 'Fitness' },
                { value: 'Appointments', label: 'Appointments' },
                { value: 'Others', label: 'Others' },
              ]}
            />
            <Button onClick={handleCreateTask}>Create Task</Button>
          </Stack>
        </Card>
      </div>

      <div className={styles['tasks__list']}>
        {tasks.map((task) => (
          <Card key={task.id} shadow="sm" p="lg" className={styles['task-card']}>
            <div className={styles['task-card__header']}>
              <Text fw={500} size="xl">{task.text}</Text>
              <div className={styles['task-card__actions']}>
                <Button
                  variant="light"
                  color={task.completed ? 'gray' : 'blue'}
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.completed ? 'Uncomplete' : 'Complete'}
                </Button>
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="lg"
                  onClick={() => setEditingTask(task)}
                >
                  <IconEdit size="1.2rem" stroke={1.5} />
                </ActionIcon>
                <ActionIcon
                  variant="filled"
                  color="red"
                  size="lg"
                  onClick={() => setDeleteConfirmTask(task)}
                >
                  <IconTrash size="1.2rem" stroke={1.5} />
                </ActionIcon>
              </div>
            </div>
            <Group mt="md">
              <Text size="sm" c="blue">{task.topic}</Text>
            </Group>
          </Card>
        ))}
      </div>

      {/* Edit Task Modal */}
      <Modal
        opened={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <Stack>
            <TextInput
              label="Text"
              value={editingTask.text}
              onChange={(e) => setEditingTask(prev => prev ? { ...prev, text: e.target.value } : null)}
              placeholder="Enter task text"
              required
            />
            <Select
              label="Topic"
              value={editingTask.topic}
              onChange={(value: string | null) => {
                if (value && ['University', 'Job', 'Fitness', 'Appointments', 'Others'].includes(value)) {
                  setEditingTask(prev => prev ? { ...prev, topic: value } : null);
                }
              }}
              data={[
                { value: 'University', label: 'University' },
                { value: 'Job', label: 'Job' },
                { value: 'Fitness', label: 'Fitness' },
                { value: 'Appointments', label: 'Appointments' },
                { value: 'Others', label: 'Others' },
              ]}
            />
            <Button onClick={handleEditTask}>Save Changes</Button>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={!!deleteConfirmTask}
        onClose={() => setDeleteConfirmTask(null)}
        title="Delete Task"
      >
        <Stack>
          <Text>Are you sure you want to delete this task?</Text>
          <Text fw={500} size="lg">{deleteConfirmTask?.text}</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setDeleteConfirmTask(null)}>Cancel</Button>
            <Button color="red" onClick={() => deleteConfirmTask && handleDeleteTask(deleteConfirmTask.id)}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
} 