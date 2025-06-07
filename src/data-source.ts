// data-source.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from '../src/users/user.entity';
import { UserSeeder } from './database/seeders/user.seed';
import { Client } from './client/client.entity';
import { Loan } from './loan/loan.entity';
import { ClientSeeder } from './database/seeders/client.seed';
import { LoanSeeder } from './database/seeders/loan.seed';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'loan_db',
  synchronize: false,
  logging: false,
  entities: [User, Client, Loan],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  seeds: [UserSeeder, ClientSeeder, LoanSeeder],
};

export const AppDataSource = new DataSource(options);
