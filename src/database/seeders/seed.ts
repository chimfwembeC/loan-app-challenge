// seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);

  await usersService.create({
    username: 'admin',
    password: 'admin123', // your service should hash this
    role: 'admin',
  });

  await usersService.create({
    username: 'staff',
    password: 'staff123',
    role: 'user',
  });

  await app.close();
}
bootstrap();
