import { DataSource } from 'typeorm';
import { User } from '../../../src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { Loan } from 'src/loan/loan.entity';
import { Client } from 'src/client/client.entity';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(User);
    // Clear order: child → parent
    // await dataSource.getRepository(Loan).clear();     // 1st
    // await dataSource.getRepository(Client).clear();   // 2nd
    // await dataSource.getRepository(User).clear();     // 3rd
    await dataSource.query('TRUNCATE TABLE "loan", "client", "user" CASCADE');

    const password = await bcrypt.hash('password', 10);

    await repo.insert([
      { username: 'admin', password, role: 'admin' },
      { username: 'staff', password, role: 'user' },
      { username: 'crock', password, role: 'user' },
    ]);
  }
}
