import { Controller, Post, Body, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ClientService } from './client.service';
import { LoanService } from '../loan/loan.service';
import { CreateClientDto } from './client.dto';
import { Client } from './client.entity';
import { Loan } from '../loan/loan.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';


@Controller('clients')
@UseGuards(AuthGuard)
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly loanService: LoanService,
  ) {}

  @Post()
  async createClient(
    @Body() createClientDto: CreateClientDto,
    @Req() req: Request,
  ): Promise<Client> {
    const user = req['user'];
    return this.clientService.createClient(createClientDto, user);
  }

  @Get()
  async getAllClients(@Req() req): Promise<Client[]> {
    const user = req['user'];
    return this.clientService.findClients(user);
  }

  @Get(':id')
  async getClient(
    @Param('id', ParseIntPipe) clientId: number,
    @Req() req
  ): Promise<Client> {
    const user = req.user;
    return this.clientService.findClientById(clientId, user);
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
