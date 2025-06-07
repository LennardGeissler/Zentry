import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import sequelize from './config/database';
import { up as createCalendarEvents } from './migrations/20240318_create_calendar_events';
import authRoutes from './routes/auth';
import { auth } from './middleware/auth';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors({
  origin: ['http://192.168.178.56:5173', 'http://localhost:5173', 'http://0.0.0.0:5173'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/api', auth, routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Database connection and server start
sequelize
  .sync()
  .then(async () => {
    try {
      await createCalendarEvents(sequelize.getQueryInterface());
      console.log('Calendar events table created successfully');
    } catch (error) {
      console.error('Error creating calendar events table:', error);
    }
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on :${port} and is accessible via network`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  }); 