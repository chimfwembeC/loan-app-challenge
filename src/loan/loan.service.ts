import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { Repository } from 'typeorm';
import { CreateLoanDto, UpdateLoanDto } from './loan.dto';
import { Client } from 'src/client/client.entity';
import { User } from 'src/users/user.entity';

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

    const hasActiveLoan = client.loans?.some(
      (loan) => loan.status === 'active',
    );
    if (hasActiveLoan) {
      throw new BadRequestException('Client already has an active loan');
    }

    const loan = this.loanRepository.create({
      ...dto,
      client,
    });

    return this.loanRepository.save(loan);
  }

  async updateLoan(id: number, dto: UpdateLoanDto, user: User): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['client', 'client.user'],
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // Authorization check: allow admins or the owner of the loan
    if (user.role !== 'admin' && loan.client.user.userId !== user.userId) {
      throw new BadRequestException('Unauthorized to update this loan');
    }

    Object.assign(loan, dto); // Merge changes from DTO into the entity

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
        user: { userId },
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
