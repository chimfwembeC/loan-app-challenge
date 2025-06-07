import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserSeeder } from 'src/database/seeders/user.seed';
import { ClientSeeder } from 'src/database/seeders/client.seed';
import { LoanSeeder } from 'src/database/seeders/loan.seed';
import { Client } from 'src/client/client.entity';

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('Starting seeding process...');

    const userSeeder = new UserSeeder();
    const clientSeeder = new ClientSeeder();
    const loanSeeder = new LoanSeeder();

    // 1. Seed users first
    await userSeeder.run(this.dataSource);

    // 2. Seed clients
    await clientSeeder.run(this.dataSource);

    // 4. Seed loans using the created clients
    await loanSeeder.run(this.dataSource);

    console.log('Seeding completed!');
  }
}
