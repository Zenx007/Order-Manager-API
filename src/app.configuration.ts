import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const CONFIGURATION = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: Number(process.env.DB_PORT) || 5432,
  USERNAME: process.env.DB_USER || 'admin',
  PASSWORD: process.env.DB_PASSWORD || 'admin',
  DATABASE: process.env.DB_NAME || 'ordermanager_db',
  JWT_SECRET:
    process.env.JWT_SECRET ||
    'f3f7e1b5b0e5d4a3c2b1a0f9e8d7c6b5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d1',
};

export default registerAs('app', () => ({
  database: {
    host: CONFIGURATION.HOST,
    port: CONFIGURATION.PORT,
    username: CONFIGURATION.USERNAME,
    password: CONFIGURATION.PASSWORD,
    name: CONFIGURATION.DATABASE,
  },
  jwt: {
    secret: CONFIGURATION.JWT_SECRET,
    expiresIn: '1h',
  },
  port: Number(process.env.PORT) || 3000,
}));
