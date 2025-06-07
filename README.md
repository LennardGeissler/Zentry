# Zentry - Task and Habit Tracking Application

A full-stack application for tracking personal tasks and habits with advanced statistics and progress monitoring.

## Features

- Task management with priorities and due dates
- Habit tracking with streaks and completion logs
- Comprehensive statistics for tasks and habits
- Daily, weekly, and monthly progress views
- Modern, responsive UI built with React and Mantine

## Tech Stack

### Frontend
- Vite
- React
- TypeScript
- SWC
- Mantine UI
- Recharts for data visualization

### Backend
- Express
- TypeScript
- Microsoft SQL Server

## Prerequisites

- Node.js (v18 or later)
- Microsoft SQL Server
- npm or yarn

## Setup Instructions

### Database Setup

1. Install Microsoft SQL Server
2. Create a new database named 'zentry'
3. Update the DATABASE_URL in server/.env with your SQL Server credentials

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Server (.env)
```
DATABASE_URL="sqlserver://localhost:1433;database=zentry;user=sa;password=YourStrong@Passw0rd;trustServerCertificate=true"
PORT=3000
NODE_ENV=development
```

## API Endpoints

### Tasks
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task
- PATCH /api/tasks/:id/toggle - Toggle task completion

### Habits
- GET /api/habits - Get all habits
- POST /api/habits - Create a new habit
- PUT /api/habits/:id - Update a habit
- DELETE /api/habits/:id - Delete a habit
- POST /api/habits/:id/log - Log habit completion

### Statistics
- GET /api/stats - Get user statistics

## Development

The application uses the following development tools:
- ESLint for code linting
- TypeScript for type safety
- Vite for frontend development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 