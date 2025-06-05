
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor
        (
            private usersService: UsersService,
            private jwtService: JwtService
        ) { }

    async signIn(
        username: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        const user = await this.usersService.findUserByName(username);
        if (!user) return null;
      
        const isPasswordValid = await this.usersService.validatePassword(pass, user.password);
        if (!isPasswordValid) return null;
      
        const payload = { sub: user.userId, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
