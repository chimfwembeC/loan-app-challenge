import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source'; // Your TypeORM DataSource
import { SeedService } from './seed.service';

async function bootstrap() {
  await AppDataSource.initialize();

  const seedService = new SeedService(AppDataSource);
  await seedService.run();

  await AppDataSource.destroy();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
});
