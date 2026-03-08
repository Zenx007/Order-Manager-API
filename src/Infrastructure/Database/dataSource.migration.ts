import 'dotenv/config';
import { DataSource } from 'typeorm';
import { EntitiesConfigurations } from './entities';

function getEnv(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export const MigrationDataSource = new DataSource({
  type: 'postgres',
  host: getEnv('DB_HOST', 'localhost'),
  port: Number(getEnv('DB_PORT', '5439')),
  username: getEnv('DB_USER', 'admin'),
  password: getEnv('DB_PASSWORD', 'admin'),
  database: getEnv('DB_NAME', 'ordermanager_db'),
  entities: [...EntitiesConfigurations],
  migrations: ['src/Infrastructure/Migrations/*.ts'],
  synchronize: true,
  migrationsTableName: '__nest_migrations',
});
