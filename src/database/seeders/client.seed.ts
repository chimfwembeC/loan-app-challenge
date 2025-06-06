import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Client } from 'src/client/client.entity';
import { User } from 'src/users/user.entity';

export class ClientSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const clientRepo = dataSource.getRepository(Client);
    const userRepo = dataSource.getRepository(User);

    // await clientRepo.clear();

    const staff = await userRepo.findOne({ where: { username: 'staff' } });
    if (!staff) throw new Error('Staff user not found');

    await clientRepo.insert([
      {
        name: 'John Doe',
        nationalId: '123456789',
        phoneNumber: '0712345678',
        user: staff,
      },
      {
        name: 'Jane Smith',
        nationalId: '987654321',
        phoneNumber: '0798765432',
        user: staff,
      },
    ]);
  }
}
