// data-source.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from '../src/users/user.entity';
import { UserSeeder } from './database/seeders/user.seed';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'loan_db',
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  seeds: [UserSeeder], // ✅ Now this works
};

export const AppDataSource = new DataSource(options);
