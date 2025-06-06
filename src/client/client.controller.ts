import { Controller, Post, Body, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ClientService } from './client.service';
import { LoanService } from '../loan/loan.service';
import { CreateClientDto } from './client.dto';
import { Client } from './client.entity';
import { Loan } from '../loan/loan.entity';

@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly loanService: LoanService,
  ) {}

  @Post()
  async createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.createClient(createClientDto);
  }

  @Get()
  async getAllClients(): Promise<Client[]> {
    return this.clientService.findAllClients();
  }

  @Get(':id/loans')
  async getLoansByClient(
    @Param('id', ParseIntPipe) clientId: number,
    @Req() req: any,  // Request with user injected by AuthGuard
  ): Promise<Loan[]> {
    const userId = req.user.userId;  // This assumes your JWT payload has userId
    return this.loanService.findLoansByClient(clientId, userId);
  }
}
