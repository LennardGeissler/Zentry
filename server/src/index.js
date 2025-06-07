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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("./config/database"));
const _20240318_create_calendar_events_1 = require("./migrations/20240318_create_calendar_events");
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3000', 10);
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://192.168.178.56:5173', 'http://localhost:5173', 'http://0.0.0.0:5173'],
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Public routes
app.use('/auth', auth_1.default);
// Protected routes
app.use('/api', auth_2.auth, routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
// Database connection and server start
database_1.default
    .sync()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, _20240318_create_calendar_events_1.up)(database_1.default.getQueryInterface());
        console.log('Calendar events table created successfully');
    }
    catch (error) {
        console.error('Error creating calendar events table:', error);
    }
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on :${port} and is accessible via network`);
    });
}))
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
