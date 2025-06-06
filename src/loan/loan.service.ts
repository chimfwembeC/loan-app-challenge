import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { Repository } from 'typeorm';
import { CreateLoanDto } from './loan.dto';
import { Client } from 'src/client/client.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createLoan(dto: CreateLoanDto, userId: number): Promise<Loan> {
    const client = await this.clientRepository.findOne({
      where: {
        id: dto.clientId,
        user: { userId }, // ✅ correct relation usage
      },
      relations: ['loans', 'user'],
    });

    if (!client) {
      throw new BadRequestException('Client not found or not authorized');
    }

    const hasActiveLoan = client.loans?.some((loan) => loan.status === 'active');
    if (hasActiveLoan) {
      throw new BadRequestException('Client already has an active loan');
    }

    const loan = this.loanRepository.create({
      ...dto,
      client,
    });

    return this.loanRepository.save(loan);
  }

  async findLoansByUser(userId: number): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { client: { user: { userId } } },
      relations: ['client'],
    });
  }

  async findLoansByClient(clientId: number, userId: number): Promise<Loan[]> {
    const client = await this.clientRepository.findOne({
      where: {
        id: clientId,
        user: { userId }, // ✅ fix here too
      },
      relations: ['user'],
    });

    if (!client) {
      throw new BadRequestException('Client not found or not authorized');
    }

    return this.loanRepository.find({
      where: { client: { id: clientId } },
    });
  }

  async findAllLoansForAdmin(): Promise<Loan[]> {
    return this.loanRepository.find({ relations: ['client'] });
  }
}
