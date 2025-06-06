import { forwardRef, Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { LoanModule } from 'src/loan/loan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    forwardRef(() => LoanModule),
    ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService, TypeOrmModule],
})
export class ClientModule {}
