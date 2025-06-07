"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarEventController = void 0;
const sequelize_1 = require("sequelize");
const CalendarEvent_1 = __importDefault(require("../models/CalendarEvent"));
exports.calendarEventController = {
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = new Date(req.query.startDate);
                const endDate = new Date(req.query.endDate);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return res.status(400).json({ message: 'Invalid start date or end date' });
                }
                const events = yield CalendarEvent_1.default.findAll({
                    where: {
                        [sequelize_1.Op.or]: [
                            {
                                startTime: {
                                    [sequelize_1.Op.between]: [startDate, endDate],
                                },
                            },
                            {
                                endTime: {
                                    [sequelize_1.Op.between]: [startDate, endDate],
                                },
                            },
                        ],
                    },
                    order: [['startTime', 'ASC']],
                });
                res.json(events);
            }
            catch (error) {
                console.error('Error fetching calendar events:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield CalendarEvent_1.default.create(req.body);
                res.status(201).json(event);
            }
            catch (error) {
                console.error('Error creating calendar event:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const event = yield CalendarEvent_1.default.findByPk(id);
                if (!event) {
                    return res.status(404).json({ message: 'Event not found' });
                }
                yield event.update(req.body);
                res.json(event);
            }
            catch (error) {
                console.error('Error updating calendar event:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const event = yield CalendarEvent_1.default.findByPk(id);
                if (!event) {
                    return res.status(404).json({ message: 'Event not found' });
                }
                yield event.destroy();
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting calendar event:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
};
