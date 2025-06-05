// src/seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'src/data-source';
import { User } from 'src/users/user.entity';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { username: 'admin' } });
  if (!existing) {
    const password = await bcrypt.hash('password123', 10);
    const adminUser = userRepo.create({
      username: 'admin',
      password,
      role: 'admin' as 'admin',
    });
    await userRepo.save(adminUser);
    console.log('✅ Admin user seeded');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
