import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Param,
    ForbiddenException,
  } from '@nestjs/common';
  import { LoanService } from './loan.service';
  import { CreateLoanDto } from './loan.dto';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { Request } from 'express';
  
  @Controller('loans')
  @UseGuards(AuthGuard)
  export class LoanController {
    constructor(private readonly loanService: LoanService) {}
  
    @Get()
    async getLoans(@Req() req: Request) {
      const user = req['user'];
    
      if (user.role === 'admin') {
        return this.loanService.findAllLoansForAdmin();
      }
    
      if (user.role === 'user') {
        return this.loanService.findLoansByUser(user.userId);
      }
    
      throw new ForbiddenException('Unauthorized role');
    }
    
    @Post()
    async createLoan(@Body() dto: CreateLoanDto, @Req() req: Request) {
      const user = req['user'];
      return this.loanService.createLoan(dto, user.userId);
    }
  
    @Get('client/:clientId')
    async getClientLoans(@Param('clientId') clientId: number, @Req() req: Request) {
      const user = req['user'];
      return this.loanService.findLoansByClient(Number(clientId), user.userId);
    }

  }
  