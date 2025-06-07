-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'zentry')
BEGIN
    CREATE DATABASE zentry;
END
GO

USE zentry;
GO

-- Drop foreign key constraints first
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FK_HabitEntries_Habits]') AND type in (N'F'))
    ALTER TABLE [dbo].[HabitEntries] DROP CONSTRAINT [FK_HabitEntries_Habits];
GO

-- Drop tables in correct order (reverse of creation order)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HabitEntries]') AND type in (N'U'))
    DROP TABLE [dbo].[HabitEntries];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Habits]') AND type in (N'U'))
    DROP TABLE [dbo].[Habits];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DailyMoods]') AND type in (N'U'))
    DROP TABLE [dbo].[DailyMoods];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DailyTasks]') AND type in (N'U'))
    DROP TABLE [dbo].[DailyTasks];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[YearlyGoals]') AND type in (N'U'))
    DROP TABLE [dbo].[YearlyGoals];
GO

-- Create YearlyGoals table
CREATE TABLE [dbo].[YearlyGoals] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [text] NVARCHAR(MAX) NOT NULL,
    [completed] BIT NOT NULL DEFAULT 0,
    [topic] NVARCHAR(50) NOT NULL CHECK (topic IN ('Career', 'Education', 'Health', 'Personal', 'Finance')),
    [userId] INT NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [updatedAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- Create DailyTasks table
CREATE TABLE [dbo].[DailyTasks] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [text] NVARCHAR(MAX) NOT NULL,
    [completed] BIT NOT NULL DEFAULT 0,
    [topic] NVARCHAR(50) NOT NULL CHECK (topic IN ('University', 'Job', 'Fitness', 'Appointments', 'Others')),
    [userId] INT NOT NULL,
    [priority] NVARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    [dueDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [createdAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [updatedAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- Create Habits table
CREATE TABLE [dbo].[Habits] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [updatedAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- Create HabitEntries table
CREATE TABLE [dbo].[HabitEntries] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [habitId] INT NOT NULL,
    [userId] INT NOT NULL,
    [date] DATE NOT NULL,
    [completed] BIT NOT NULL DEFAULT 0,
    [createdAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [updatedAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- Add foreign key constraint after tables are created
ALTER TABLE [dbo].[HabitEntries]
ADD CONSTRAINT [FK_HabitEntries_Habits] 
FOREIGN KEY ([habitId]) REFERENCES [dbo].[Habits] ([id]) ON DELETE CASCADE;
GO

-- Add unique constraint for HabitEntries
ALTER TABLE [dbo].[HabitEntries]
ADD CONSTRAINT [UQ_HabitEntries_HabitDate] 
UNIQUE ([habitId], [date], [userId]);
GO

-- Create DailyMoods table
CREATE TABLE [dbo].[DailyMoods] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [userId] INT NOT NULL,
    [date] DATE NOT NULL,
    [happy] BIT NOT NULL DEFAULT 0,
    [productive] BIT NOT NULL DEFAULT 0,
    [stressed] BIT NOT NULL DEFAULT 0,
    [tired] BIT NOT NULL DEFAULT 0,
    [createdAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [updatedAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT [UQ_DailyMoods_UserDate] UNIQUE ([userId], [date])
);
GO

-- Create indexes for better query performance
CREATE INDEX [IX_YearlyGoals_UserId] ON [dbo].[YearlyGoals] ([userId]);
GO

CREATE INDEX [IX_DailyTasks_UserId_DueDate] ON [dbo].[DailyTasks] ([userId], [dueDate]);
GO

CREATE INDEX [IX_Habits_UserId] ON [dbo].[Habits] ([userId]);
GO

CREATE INDEX [IX_HabitEntries_UserId_Date] ON [dbo].[HabitEntries] ([userId], [date]);
GO

CREATE INDEX [IX_DailyMoods_UserId_Date] ON [dbo].[DailyMoods] ([userId], [date]);
GO 