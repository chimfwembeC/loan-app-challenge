import { forwardRef, Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan]),
    forwardRef(() => ClientModule),
],
  controllers: [LoanController],
  providers: [LoanService],
  exports: [LoanService],
})
export class LoanModule {}
