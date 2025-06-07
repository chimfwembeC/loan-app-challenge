import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the client',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Unique national ID of the client',
  })
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @ApiProperty({
    example: '+254712345678',
    description: 'Phone number of the client in international format',
  })
  @IsPhoneNumber(null)
  phoneNumber: string;
}
