import { Connection, Request } from 'tedious';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_HOST || 'localhost',
  authentication: {
    type: 'default' as const,
    options: {
      userName: process.env.DB_USER || 'zentry-admin',
      password: process.env.DB_PASSWORD || 'zentry123',
    },
  },
  options: {
    trustServerCertificate: true,
    database: 'master', // Connect to master first to create the database
    encrypt: false,
  },
};

function executeSqlFile(connection: Connection, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    const sqlStatements = sqlContent.split('GO').filter(stmt => stmt.trim());

    let currentStatement = 0;

    function executeNextStatement() {
      if (currentStatement >= sqlStatements.length) {
        resolve();
        return;
      }

      const request = new Request(sqlStatements[currentStatement].trim(), (err) => {
        if (err) {
          reject(err);
          return;
        }

        currentStatement++;
        executeNextStatement();
      });

      connection.execSql(request);
    }

    executeNextStatement();
  });
}

async function initializeDatabase() {
  const connection = new Connection(config);

  connection.on('connect', async (err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      process.exit(1);
    }

    try {
      console.log('Connected to database. Initializing...');
      const sqlFilePath = path.join(__dirname, 'init-database.sql');
      await executeSqlFile(connection, sqlFilePath);
      console.log('Database initialization completed successfully.');
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      connection.close();
    }
  });

  connection.connect();
}

initializeDatabase(); 