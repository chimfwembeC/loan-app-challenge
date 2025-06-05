import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'loan_db',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
