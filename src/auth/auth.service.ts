import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserByName(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      pass,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.userId, username: user.username,role: user.role,  };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(username: string, pass: string): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findUserByName(username);
    if (existingUser) {
      throw new UnauthorizedException('Username already taken');
    }
  
    const newUser = await this.usersService.create({
      username,
      password: pass,
      role: 'user', // or 'admin' if you're registering admins
    });
  
    const payload = { userId: newUser.userId, username: newUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
}
