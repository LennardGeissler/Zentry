import { useState, useEffect } from 'react';
import { Card, Text, Button, Select, Grid, ActionIcon, Modal, TextInput, Textarea, ColorInput, Checkbox, Stack, Group, Divider } from '@mantine/core';
import { TimeInput, DatePickerInput } from '@mantine/dates';
import { IconChevronLeft, IconChevronRight, IconPlus, IconCalendar, IconClock, IconPalette, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { calendarEventService } from '../../services/api/calendarEventService';
import type { CalendarEvent } from '../../types';
import styles from './Calendar.module.scss';
import { format } from 'date-fns';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasEvents: boolean;
  events: CalendarEvent[];
}

type CalendarView = 'month' | 'week' | 'day';

interface NewEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  color: string;
  allDay: boolean;
}

const DEFAULT_EVENT_COLORS = [
  '#4285f4', // Blue
  '#ea4335', // Red
  '#fbbc05', // Yellow
  '#34a853', // Green
  '#ff7597', // Pink
  '#ff6d01', // Orange
  '#46bdc6', // Cyan
  '#7986cb', // Indigo
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    color: DEFAULT_EVENT_COLORS[0],
    allDay: false,
  });

  useEffect(() => {
    loadEvents();
  }, [currentDate, view]);

  const loadEvents = async () => {
    try {
      // Calculate date range based on view
      let startDate: Date, endDate: Date;
      if (view === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else if (view === 'week') {
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay());
        startDate = start;
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        endDate = end;
      } else {
        startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        endDate = new Date(currentDate.setHours(23, 59, 59, 999));
      }

      console.log('Fetching events for range:', { startDate, endDate });
      const fetchedEvents = await calendarEventService.getEvents(startDate, endDate);
      console.log('Fetched events:', fetchedEvents);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load events',
        color: 'red',
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!newEvent.title.trim()) {
        notifications.show({
          title: 'Error',
          message: 'Event title is required',
          color: 'red',
        });
        return;
      }

      const createdEvent = await calendarEventService.createEvent(newEvent);
      setEvents(prev => [...prev, createdEvent]);
      setIsCreateModalOpen(false);
      resetNewEvent();
      loadEvents();

      notifications.show({
        title: 'Success',
        message: 'Event created successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error creating event:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create event',
        color: 'red',
      });
    }
  };

  const resetNewEvent = () => {
    const defaultStartTime = selectedDate || new Date();
    defaultStartTime.setHours(9, 0, 0, 0);
    const defaultEndTime = new Date(defaultStartTime);
    defaultEndTime.setHours(10, 0, 0, 0);

    setNewEvent({
      title: '',
      description: '',
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      color: DEFAULT_EVENT_COLORS[0],
      allDay: false,
    });
    setSelectedDate(null);
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: CalendarDay[] = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1);
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        hasEvents: false,
        events: getEventsForDate(date),
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        hasEvents: false,
        events: getEventsForDate(date),
      });
    }

    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        hasEvents: false,
        events: getEventsForDate(date),
      });
    }

    return days;
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      
      return (
        (eventStart >= dayStart && eventStart <= dayEnd) || // Event starts on this day
        (eventEnd >= dayStart && eventEnd <= dayEnd) || // Event ends on this day
        (eventStart <= dayStart && eventEnd >= dayEnd) // Event spans over this day
      );
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const defaultStartTime = new Date(date);
    defaultStartTime.setHours(9, 0, 0, 0);
    const defaultEndTime = new Date(date);
    defaultEndTime.setHours(10, 0, 0, 0);

    setNewEvent(prev => ({
      ...prev,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    }));
    setIsCreateModalOpen(true);
  };

  const renderEventModal = () => (
    <Modal
      opened={isCreateModalOpen}
      onClose={() => {
        setIsCreateModalOpen(false);
        resetNewEvent();
      }}
      title={<Text size="lg" fw={600}>Create Event</Text>}
      size="md"
      padding="xl"
      radius="md"
      closeButtonProps={{
        icon: <IconX size={20} />,
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
    >
      <Stack gap="lg">
        <TextInput
          label="Title"
          placeholder="Add title"
          value={newEvent.title}
          onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
          required
          size="md"
          leftSection={<IconCalendar size={16} stroke={1.5} />}
        />

        <Textarea
          label="Description"
          placeholder="Add description"
          value={newEvent.description}
          onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
          autosize
          minRows={2}
          maxRows={4}
          size="md"
        />

        <Divider my="xs" label="Date and Time" labelPosition="center" />

        <Group grow align="flex-start">
          <DatePickerInput
            label="Date"
            value={newEvent.startTime}
            onChange={(date) => {
              if (date) {
                const newStartTime = new Date(date);
                newStartTime.setHours(newEvent.startTime.getHours(), newEvent.startTime.getMinutes());
                const newEndTime = new Date(date);
                newEndTime.setHours(newEvent.endTime.getHours(), newEvent.endTime.getMinutes());
                setNewEvent(prev => ({
                  ...prev,
                  startTime: newStartTime,
                  endTime: newEndTime,
                }));
              }
            }}
            required
            size="md"
            leftSection={<IconCalendar size={16} stroke={1.5} />}
            clearable={false}
            popoverProps={{ withinPortal: true }}
          />
          <Checkbox
            label="All day event"
            checked={newEvent.allDay}
            onChange={(e) => setNewEvent(prev => ({ ...prev, allDay: e.currentTarget.checked }))}
            size="md"
            mt={35}
          />
        </Group>

        {!newEvent.allDay && (
          <Group grow>
            <TimeInput
              label="Start Time"
              value={format(newEvent.startTime, 'HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.currentTarget.value.split(':').map(Number);
                const newTime = new Date(newEvent.startTime);
                if (!isNaN(hours) && !isNaN(minutes)) {
                  newTime.setHours(hours, minutes);
                  setNewEvent(prev => ({ ...prev, startTime: newTime }));
                }
              }}
              size="md"
              leftSection={<IconClock size={16} stroke={1.5} />}
            />
            <TimeInput
              label="End Time"
              value={format(newEvent.endTime, 'HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.currentTarget.value.split(':').map(Number);
                const newTime = new Date(newEvent.endTime);
                if (!isNaN(hours) && !isNaN(minutes)) {
                  newTime.setHours(hours, minutes);
                  setNewEvent(prev => ({ ...prev, endTime: newTime }));
                }
              }}
              size="md"
              leftSection={<IconClock size={16} stroke={1.5} />}
            />
          </Group>
        )}

        <Divider my="xs" label="Appearance" labelPosition="center" />

        <ColorInput
          label="Event Color"
          format="hex"
          swatches={DEFAULT_EVENT_COLORS}
          value={newEvent.color}
          onChange={(color) => setNewEvent(prev => ({ ...prev, color: color }))}
          size="md"
          leftSection={<IconPalette size={16} stroke={1.5} />}
          swatchesPerRow={8}
          popoverProps={{ withinPortal: true }}
        />

        <Group justify="flex-end" mt="xl">
          <Button 
            variant="subtle" 
            color="gray"
            onClick={() => {
              setIsCreateModalOpen(false);
              resetNewEvent();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateEvent}>
            Create Event
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  const renderMonthView = () => {
    const calendarDays = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <Grid className={styles.calendar__grid} gutter={0}>
        {weekDays.map(day => (
          <Grid.Col span={1.7} key={day} className={styles.calendar__weekday}>
            <Text size="sm" fw={500}>{day}</Text>
          </Grid.Col>
        ))}
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          return (
            <Grid.Col
              span={1.7}
              key={index}
              className={`${styles.calendar__day} ${
                !day.isCurrentMonth ? styles['calendar__day--dimmed'] : ''
              } ${
                day.date.toDateString() === new Date().toDateString()
                  ? styles['calendar__day--today']
                  : ''
              }`}
              onClick={() => handleDayClick(day.date)}
            >
              <div className={styles.calendar__dayContent}>
                <div className={styles.calendar__dayNumber}>
                  <Text size="sm">{day.date.getDate()}</Text>
                </div>
                <div className={styles.calendar__events}>
                  {dayEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={styles.calendar__event}
                      style={{ backgroundColor: event.color || '#4285f4' }}
                      title={`${event.title}${event.description ? ` - ${event.description}` : ''}`}
                    >
                      <Text size="xs" truncate>
                        {event.allDay ? event.title : `${new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ${event.title}`}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </Grid.Col>
          );
        })}
      </Grid>
    );
  };

  const getDaysInWeek = (date: Date): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push({
        date: currentDay,
        isCurrentMonth: currentDay.getMonth() === date.getMonth(),
        hasEvents: false, // TODO: Check for events
        events: getEventsForDate(currentDay),
      });
    }

    return days;
  };

  const getHoursInDay = (date: Date) => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = new Date(date);
      hour.setHours(i, 0, 0, 0);
      hours.push(hour);
    }
    return hours;
  };

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
      } else if (view === 'week') {
        const days = direction === 'prev' ? -7 : 7;
        newDate.setDate(newDate.getDate() + days);
      } else {
        const days = direction === 'prev' ? -1 : 1;
        newDate.setDate(newDate.getDate() + days);
      }
      return newDate;
    });
  };

  const formatTimeSlot = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  };

  const renderWeekView = () => {
    const weekDays = getDaysInWeek(currentDate);
    const hours = getHoursInDay(currentDate);
    const today = new Date().toDateString();

    return (
      <div className={styles.calendar__weekView}>
        <Grid gutter={0} style={{ minWidth: '800px' }}>
          <Grid.Col span={1}>
            <div className={styles.calendar__timeColumn}>
              <div className={styles.calendar__timeHeader} />
              {hours.map((hour, index) => (
                <div key={index} className={styles.calendar__timeSlot}>
                  <Text size="xs">{formatTimeSlot(hour)}</Text>
                </div>
              ))}
            </div>
          </Grid.Col>
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day.date);
            return (
              <Grid.Col span={1.57} key={dayIndex}>
                <div className={styles.calendar__dayColumn}>
                  <div className={styles.calendar__dayHeader}>
                    <Text size="sm" fw={500}>
                      {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <div className={`${styles.calendar__dayNumber} ${
                      day.date.toDateString() === today ? styles['calendar__dayNumber--today'] : ''
                    }`}>
                      <Text size="sm">{day.date.getDate()}</Text>
                    </div>
                  </div>
                  <div className={styles.calendar__dayContent}>
                    {hours.map((hour, hourIndex) => (
                      <div key={hourIndex} className={styles.calendar__timeSlot}>
                        {dayEvents
                          .filter(event => {
                            const eventStart = new Date(event.startTime);
                            return eventStart.getHours() === hour.getHours();
                          })
                          .map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={styles.calendar__event}
                              style={{
                                backgroundColor: event.color || '#4285f4',
                                top: `${(new Date(event.startTime).getMinutes() / 60) * 100}%`,
                                height: `${calculateEventHeight(event)}%`,
                              }}
                              title={`${event.title}${event.description ? ` - ${event.description}` : ''}`}
                            >
                              <Text size="xs" truncate>
                                {`${new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ${event.title}`}
                              </Text>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Grid.Col>
            );
          })}
        </Grid>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = getHoursInDay(currentDate);
    const today = new Date().toDateString();
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className={styles.calendar__dayView}>
        <Grid gutter={0} style={{ minWidth: '800px' }}>
          <Grid.Col span={1}>
            <div className={styles.calendar__timeColumn}>
              <div className={styles.calendar__timeHeader} />
              {hours.map((hour, index) => (
                <div key={index} className={styles.calendar__timeSlot}>
                  <Text size="xs">{formatTimeSlot(hour)}</Text>
                </div>
              ))}
            </div>
          </Grid.Col>
          <Grid.Col span={11}>
            <div className={styles.calendar__dayColumn}>
              <div className={styles.calendar__dayHeader}>
                <Text size="sm" fw={500}>
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
                <div className={`${styles.calendar__dayNumber} ${
                  currentDate.toDateString() === today ? styles['calendar__dayNumber--today'] : ''
                }`}>
                  <Text size="sm">{currentDate.getDate()}</Text>
                </div>
              </div>
              <div className={styles.calendar__dayContent}>
                {hours.map((hour, hourIndex) => (
                  <div key={hourIndex} className={styles.calendar__timeSlot}>
                    {dayEvents
                      .filter(event => {
                        const eventStart = new Date(event.startTime);
                        return eventStart.getHours() === hour.getHours();
                      })
                      .map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={styles.calendar__event}
                          style={{
                            backgroundColor: event.color || '#4285f4',
                            top: `${(new Date(event.startTime).getMinutes() / 60) * 100}%`,
                            height: `${calculateEventHeight(event)}%`,
                          }}
                          title={`${event.title}${event.description ? ` - ${event.description}` : ''}`}
                        >
                          <Text size="xs" truncate>
                            {`${new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ${event.title}`}
                          </Text>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </div>
    );
  };

  const calculateEventHeight = (event: CalendarEvent) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return (durationInMinutes / 60) * 100;
  };

  const renderView = () => {
    switch (view) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return null;
    }
  };

  return (
    <div className={styles.calendar}>
      <Card 
        shadow="sm" 
        p="lg" 
        className={styles.calendar__card}
        bg="var(--mantine-color-dark-7)"
        withBorder
      >
        <div className={styles.calendar__header}>
          <div className={styles.calendar__title}>
            <Text size="xl" fw={500}>
              {currentDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
                ...(view === 'day' && { day: 'numeric' }),
              })}
            </Text>
          </div>
          <div className={styles.calendar__controls}>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                setSelectedDate(currentDate);
                setIsCreateModalOpen(true);
              }}
            >
              Create Event
            </Button>
            <Select
              value={view}
              onChange={(value) => value && setView(value as CalendarView)}
              data={[
                { value: 'month', label: 'Month' },
                { value: 'week', label: 'Week' },
                { value: 'day', label: 'Day' },
              ]}
              className={styles.calendar__viewSelect}
            />
            <div className={styles.calendar__navigation}>
              <ActionIcon onClick={() => navigate('prev')}>
                <IconChevronLeft size={20} />
              </ActionIcon>
              <Button
                variant="subtle"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <ActionIcon onClick={() => navigate('next')}>
                <IconChevronRight size={20} />
              </ActionIcon>
            </div>
          </div>
        </div>

        <div className={styles.calendar__body}>
          {renderView()}
        </div>
      </Card>
      {renderEventModal()}
    </div>
  );
} 