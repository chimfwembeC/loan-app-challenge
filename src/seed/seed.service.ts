import { Injectable } from '@nestjs/common';
import { UserSeeder } from 'src/database/seeders/user.seed';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('Starting seeding process...');

    // Create instances of each seeder
    const userSeeder = new UserSeeder();

    // Run seeders sequentially
    await userSeeder.run(this.dataSource);

    console.log('Seeding completed!');
  }
}
