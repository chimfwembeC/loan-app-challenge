import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createClient(dto: CreateClientDto): Promise<Client> {
    // Check unique nationalId
    const existingByNationalId = await this.clientRepository.findOne({ where: { nationalId: dto.nationalId } });
    if (existingByNationalId) {
      throw new BadRequestException('National ID already exists');
    }

    // Check unique phoneNumber
    const existingByPhone = await this.clientRepository.findOne({ where: { phoneNumber: dto.phoneNumber } });
    if (existingByPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const client = this.clientRepository.create(dto);
    return this.clientRepository.save(client);
  }

  async findAllClients(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }
}
