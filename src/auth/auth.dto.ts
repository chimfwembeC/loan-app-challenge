import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username for the user account',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description:
      'A strong password including uppercase, lowercase, number, and special character',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
