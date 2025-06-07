import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true), // Always allow for testing
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token on valid credentials', async () => {
      const mockResult = { access_token: 'jwt-token' };
      mockAuthService.signIn.mockResolvedValue(mockResult);

      const body = { username: 'testuser', password: 'testpass' };
      const result = await controller.signIn(body);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        'testuser',
        'testpass',
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getProfile', () => {
    it('should return user from request object', () => {
      const mockRequest = { user: { id: 1, username: 'testuser' } };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });
});
