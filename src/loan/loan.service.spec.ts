import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { Client } from '../../src/client/client.entity';
import { User } from '../../src/users/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('LoanService', () => {
  let service: LoanService;
  let loanRepo: Partial<Record<keyof Repository<Loan>, jest.Mock>>;
  let clientRepo: Partial<Record<keyof Repository<Client>, jest.Mock>>;

  beforeEach(async () => {
    loanRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    clientRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        { provide: getRepositoryToken(Loan), useValue: loanRepo },
        { provide: getRepositoryToken(Client), useValue: clientRepo },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  const mockUser: User = {
    userId: 1,
    username: 'john',
    password: 'hashed',
    role: 'user',
    clients: [],
    loans: [],
  };

  const mockAdmin: User = {
    userId: 2,
    username: 'admin',
    password: 'hashed',
    role: 'admin',
    clients: [],
    loans: [],
  };

  const createMockLoan = (status: 'pending' | 'active' | 'closed') => ({
    id: Math.floor(Math.random() * 1000),
    amount: 1000,
    term: 12,
    interestRate: 5,
    client: {} as any,
    status,
  });
  describe('createLoan', () => {
    it('should create loan if client is valid and has no active loan', async () => {
      const client: Partial<Client> = {
        id: 5,
        loans: [],
        user: mockUser,
      };

      clientRepo.findOne!.mockResolvedValue(client);
      loanRepo.create!.mockReturnValue({ amount: 1000, client });
      loanRepo.save!.mockResolvedValue({ id: 1, amount: 1000 });

      const result = await service.createLoan(
        {
          amount: 5000,
          term: 12,
          interestRate: 5.5,
          clientId: 1
        },
        mockUser.userId,
      );

      expect(result).toEqual({ id: 1, amount: 1000 });
    });

    it('should throw if client not found', async () => {
      clientRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.createLoan({ amount: 500, clientId: 99,  term: 12, interestRate: 5.5, }, mockUser.userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if client has active loan', async () => {
      const client: Partial<Client> = {
        loans: [{
          id: 1,
          amount: 1000,
          term: 12,
          interestRate: 5,
          client: {} as any,
          status: 'active',
          createdBy: mockUser,
        }],
        user: mockUser,
      };
      clientRepo.findOne!.mockResolvedValue(client);

      await expect(
        service.createLoan({ amount: 1000, clientId: 3, term: 12, interestRate: 5.5, }, mockUser.userId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateLoan', () => {
    it('should update and save loan if user is admin', async () => {
      const loan: any = {
        id: 1,
        amount: 1000,
        client: { user: mockUser },
      };

      loanRepo.findOne!.mockResolvedValue(loan);
      loanRepo.save!.mockResolvedValue({ ...loan, amount: 2000 });

      const result = await service.updateLoan(1, { amount: 2000 }, mockAdmin);
      expect(result.amount).toBe(2000);
    });

    it('should update and save loan if user is the owner', async () => {
      const loan: any = {
        id: 1,
        amount: 1000,
        client: { user: mockUser },
      };

      loanRepo.findOne!.mockResolvedValue(loan);
      loanRepo.save!.mockResolvedValue({ ...loan, amount: 3000 });

      const result = await service.updateLoan(1, { amount: 3000 }, mockUser);
      expect(result.amount).toBe(3000);
    });

    it('should throw if loan not found', async () => {
      loanRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.updateLoan(1, { amount: 1000 }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if user is not admin or owner', async () => {
      const anotherUser: User = { ...mockUser, userId: 99 };
      const loan = {
        id: 1,
        client: { user: mockUser }, // not same as anotherUser
      };

      loanRepo.findOne!.mockResolvedValue(loan);

      await expect(
        service.updateLoan(1, { amount: 500 }, anotherUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findLoansByUser', () => {
    it('should return loans belonging to user', async () => {
      const loans = [
        { id: 1, client: { user: { userId: mockUser.userId } } },
        { id: 2, client: { user: { userId: mockUser.userId } } },
      ];
      loanRepo.find!.mockResolvedValue(loans);

      const result = await service.findLoansByUser(mockUser.userId);
      expect(result).toEqual(loans);
    });
  });

  describe('findLoansByClient', () => {
    it('should return client loans if authorized', async () => {
      const client: Partial<Client> = { id: 3, user: mockUser };
      const loans = [{ id: 1 }, { id: 2 }];

      clientRepo.findOne!.mockResolvedValue(client);
      loanRepo.find!.mockResolvedValue(loans);

      const result = await service.findLoansByClient(client.id, mockUser.userId);
      expect(result).toEqual(loans);
    });

    it('should throw if client not found or unauthorized', async () => {
      clientRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.findLoansByClient(99, mockUser.userId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllLoansForAdmin', () => {
    it('should return all loans with clients', async () => {
      const loans = [
        { id: 1, client: {} },
        { id: 2, client: {} },
      ];
      loanRepo.find!.mockResolvedValue(loans);

      const result = await service.findAllLoansForAdmin();
      expect(result).toEqual(loans);
    });
  });
});
