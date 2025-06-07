import { Router } from 'express';
import { calendarEventController } from '../controllers/calendarEventController';

const router = Router();

router.get('/', calendarEventController.getEvents);
router.post('/', calendarEventController.createEvent);
router.put('/:id', calendarEventController.updateEvent);
router.delete('/:id', calendarEventController.deleteEvent);

export default router; 