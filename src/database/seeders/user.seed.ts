import { DataSource } from 'typeorm';
import { User } from '../../../src/users/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(User);
    await repo.clear();

    const password = await bcrypt.hash('password', 10);

    await repo.insert([
      { username: 'admin', password, role: 'admin' },
      { username: 'staff', password, role: 'user' },
    ]);
  }
}
