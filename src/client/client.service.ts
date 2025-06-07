import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './client.dto';
import { User } from 'src/users/user.entity';
import { Loan } from 'src/loan/loan.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findClients(user: User): Promise<Client[]> {
    if (user.role === 'admin') {
      // Admin can see all clients
      return this.clientRepository.find({
        relations: ['user', 'loans'],
      });
    }

    // Regular user can only see their own clients
    return this.clientRepository.find({
      where: { user: { userId: user.userId } },
      relations: ['user', 'loans'],
    });
  }

  async createClient(dto: CreateClientDto, user: User): Promise<Client> {
    const existsNationalId = await this.clientRepository.findOne({
      where: { nationalId: dto.nationalId },
    });
    if (existsNationalId) {
      throw new BadRequestException('National ID already exists');
    }

    const existsPhone = await this.clientRepository.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (existsPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const client = this.clientRepository.create({
      ...dto,
      user,
    });

    return this.clientRepository.save(client);
  }

  async updateClient(
    id: number,
    dto: UpdateClientDto,
    user: User,
  ): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (user.role !== 'admin' && client.user.userId !== user.userId) {
      throw new BadRequestException('Unauthorized to update this client');
    }

    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  async findClientById(id: number, user: User): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['user', 'loans'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (user.role !== 'admin' && client.user.userId !== user.userId) {
      throw new BadRequestException('Unauthorized access to client');
    }

    return client;
  }

  async findLoansByClientId(clientId: number, user: User): Promise<Loan[]> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
      relations: ['loans', 'user'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (user.role !== 'admin' && client.user.userId !== user.userId) {
      throw new BadRequestException('Unauthorized access to client loans');
    }

    return client.loans;
  }
}
