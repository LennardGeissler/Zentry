import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'zentry-admin',
  password: process.env.DB_PASSWORD || 'zentry123',
  database: process.env.DB_NAME || 'zentry',
  dialectOptions: {
    options: {
      trustServerCertificate: true,
    },
  },
});

export default sequelize; 