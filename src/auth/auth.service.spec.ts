import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findUserByName: jest.fn(),
      validatePassword: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return access token on valid credentials', async () => {
      const mockUser = { userId: 1, username: 'test', password: 'hashed', role: 'user' };
      usersService.findUserByName!.mockResolvedValue(mockUser);
      usersService.validatePassword!.mockResolvedValue(true);
      jwtService.signAsync!.mockResolvedValue('signed-token');

      const result = await authService.signIn('test', 'password');
      expect(result).toEqual({ access_token: 'signed-token' });
    });

    it('should throw on invalid username', async () => {
      usersService.findUserByName!.mockResolvedValue(null);

      await expect(authService.signIn('wrong', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw on invalid password', async () => {
      usersService.findUserByName!.mockResolvedValue({ username: 'test', password: 'hashed' });
      usersService.validatePassword!.mockResolvedValue(false);

      await expect(authService.signIn('test', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should create user and return token', async () => {
      usersService.findUserByName!.mockResolvedValue(null);
      usersService.create!.mockResolvedValue({ userId: 2, username: 'newuser' });
      jwtService.signAsync!.mockResolvedValue('new-token');

      const result = await authService.signUp('newuser', 'pass123');
      expect(result).toEqual({ access_token: 'new-token' });
    });

    it('should throw if username already exists', async () => {
      usersService.findUserByName!.mockResolvedValue({ username: 'existing' });

      await expect(authService.signUp('existing', 'pass')).rejects.toThrow(UnauthorizedException);
    });
  });
});
