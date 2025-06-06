import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { ClientModule } from './client/client.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
       type: 'postgres',
       host: configService.get("DB_HOST"),
       port: configService.get("DB_PORT"),
       username: configService.get("DB_USERNAME"),
       password: configService.get("DB_PASSWORD"),
       database: configService.get("DB_NAME"),
       entities: [__dirname + '/**/*.entity{.ts,.js}'],
       migrations: [__dirname + '/migrations/*.ts'],
       autoLoadEntities: true,
       synchronize: true,
      })
     }),
    AuthModule,
    UsersModule,
    SeedModule,
    ClientModule,
    LoanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

