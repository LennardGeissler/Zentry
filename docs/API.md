# 🔌 Zentry API Documentation

## 📚 Table of Contents
- [Authentication](#authentication)
- [Tasks API](#tasks-api)
- [Goals API](#goals-api)
- [Habits API](#habits-api)
- [Statistics API](#statistics-api)
- [Mood API](#mood-api)

## 🔐 Authentication

All API endpoints require JWT authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Getting a Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## 📋 Tasks API

### Get Daily Tasks
```http
GET /api/tasks/daily
```

Response:
```json
{
  "tasks": [
    {
      "id": "123",
      "title": "Complete project documentation",
      "description": "Write API documentation for the Zentry project",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "dueDate": "2024-03-20T15:00:00Z",
      "category": "WORK",
      "createdAt": "2024-03-19T10:00:00Z",
      "updatedAt": "2024-03-19T10:00:00Z"
    }
  ]
}
```

### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write API documentation for the Zentry project",
  "priority": "HIGH",
  "category": "WORK",
  "dueDate": "2024-03-20T15:00:00Z"
}
```

### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "COMPLETED"
}
```

### Delete Task
```http
DELETE /api/tasks/:id
```

## 🎯 Goals API

### Get Yearly Goals
```http
GET /api/yearly-goals
```

Response:
```json
{
  "goals": [
    {
      "id": "123",
      "title": "Learn TypeScript",
      "description": "Master TypeScript for web development",
      "category": "EDUCATION",
      "progress": 60,
      "targetDate": "2024-12-31T23:59:59Z",
      "status": "IN_PROGRESS",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-03-19T10:00:00Z"
    }
  ]
}
```

### Create Goal
```http
POST /api/yearly-goals
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "description": "Master TypeScript for web development",
  "category": "EDUCATION",
  "targetDate": "2024-12-31T23:59:59Z"
}
```

### Update Goal Progress
```http
PUT /api/yearly-goals/:id
Content-Type: application/json

{
  "progress": 75,
  "status": "IN_PROGRESS"
}
```

### Delete Goal
```http
DELETE /api/yearly-goals/:id
```

## ⚡ Habits API

### Get All Habits
```http
GET /api/habits
```

Response:
```json
{
  "habits": [
    {
      "id": "123",
      "title": "Morning Exercise",
      "description": "30 minutes of cardio",
      "category": "HEALTH",
      "frequency": "DAILY",
      "streak": 5,
      "lastCompleted": "2024-03-19T06:00:00Z",
      "createdAt": "2024-03-01T00:00:00Z",
      "updatedAt": "2024-03-19T06:00:00Z"
    }
  ]
}
```

### Create Habit
```http
POST /api/habits
Content-Type: application/json

{
  "title": "Morning Exercise",
  "description": "30 minutes of cardio",
  "category": "HEALTH",
  "frequency": "DAILY"
}
```

### Log Habit Completion
```http
POST /api/habits/:id/log
Content-Type: application/json

{
  "completedAt": "2024-03-19T06:00:00Z",
  "notes": "Completed morning run"
}
```

## 📊 Statistics API

### Get User Statistics
```http
GET /api/stats
```

Response:
```json
{
  "tasks": {
    "completed": 25,
    "inProgress": 5,
    "overdue": 2,
    "completionRate": 78.125
  },
  "habits": {
    "active": 5,
    "averageStreak": 7.2,
    "bestStreak": 15
  },
  "goals": {
    "completed": 3,
    "inProgress": 4,
    "averageProgress": 65.5
  }
}
```

### Get Daily Statistics
```http
GET /api/stats/daily?date=2024-03-19
```

### Get Weekly Statistics
```http
GET /api/stats/weekly?startDate=2024-03-18
```

### Get Monthly Statistics
```http
GET /api/stats/monthly?month=3&year=2024
```

## 🌟 Mood API

### Get Daily Mood
```http
GET /api/mood/daily?date=2024-03-19
```

Response:
```json
{
  "mood": {
    "id": "123",
    "date": "2024-03-19",
    "emotionalState": "HAPPY",
    "energyLevel": 8,
    "stressLevel": 3,
    "notes": "Productive day with good progress",
    "createdAt": "2024-03-19T21:00:00Z"
  }
}
```

### Save Mood Data
```http
POST /api/mood
Content-Type: application/json

{
  "emotionalState": "HAPPY",
  "energyLevel": 8,
  "stressLevel": 3,
  "notes": "Productive day with good progress"
}
```

## 🔍 Query Parameters

Many endpoints support additional query parameters for filtering and pagination:

- `limit`: Number of items per page (default: 20)
- `page`: Page number for pagination (default: 1)
- `sort`: Sort field (e.g., "createdAt", "dueDate")
- `order`: Sort order ("asc" or "desc")
- `category`: Filter by category
- `status`: Filter by status
- `startDate`: Filter by start date
- `endDate`: Filter by end date

Example:
```http
GET /api/tasks/daily?limit=10&page=2&sort=dueDate&order=asc&category=WORK
```

## ⚠️ Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "title",
      "issue": "Title is required"
    }
  }
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `500`: Internal Server Error

## 🔄 Rate Limiting

API requests are rate-limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
``` 