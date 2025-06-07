import axios from 'axios';
import type { CalendarEvent } from '../../types';

const BASE_URL = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/calendar-events`;

export const calendarEventService = {
  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const { data } = await axios.get(BASE_URL, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return data.map((event: any) => ({
      ...event,
      startTime: new Date(event.startTime),
      endTime: new Date(event.endTime),
    }));
  },

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const { data } = await axios.post(BASE_URL, event);
    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    };
  },

  async updateEvent(id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const { data } = await axios.put(`${BASE_URL}/${id}`, event);
    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    };
  },

  async deleteEvent(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
  },
}; 