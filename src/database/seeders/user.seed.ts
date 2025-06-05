// seeds/user.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repo = dataSource.getRepository(User);
    await repo.insert([
      {
        username: 'admin',
        password: 'hashedpass',
        role: 'admin',
      },
      {
        username: 'staff',
        password: 'hashedpass',
        role: 'user',
      },
    ]);
  }
}
