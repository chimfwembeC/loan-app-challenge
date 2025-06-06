import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Loan } from 'src/loan/loan.entity';
import { Client } from 'src/client/client.entity';
import { User } from 'src/users/user.entity';

export class LoanSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const loanRepo = dataSource.getRepository(Loan);
    const clientRepo = dataSource.getRepository(Client);
    const userRepo = dataSource.getRepository(User);

    // await loanRepo.clear();

    const admin = await userRepo.findOne({ where: { username: 'admin' } });
    if (!admin) throw new Error('Admin user not found');

    const clients = await clientRepo.find();

    if (clients.length < 2) throw new Error('Not enough clients to seed loans');

    await loanRepo.insert([
      {
        amount: 1000,
        term: 12,
        interestRate: 5.0,
        status: 'active',
        client: clients[0],
        createdBy: admin,
      },
      {
        amount: 2000,
        term: 24,
        interestRate: 6.5,
        status: 'pending',
        client: clients[1],
        createdBy: admin,
      },
    ]);
  }
}
