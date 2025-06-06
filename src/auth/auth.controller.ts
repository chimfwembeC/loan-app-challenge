import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;
    return this.authService.signIn(username, password);
  }

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;
    return this.authService.signUp(username, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
