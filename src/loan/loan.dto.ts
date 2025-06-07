import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    example: 5000,
    description: 'The principal amount of the loan',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 12,
    description: 'The term of the loan in months',
  })
  @IsInt()
  term: number;

  @ApiProperty({
    example: 5.5,
    description: 'The interest rate as a percentage',
  })
  @IsNumber()
  interestRate: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the client receiving the loan',
  })
  @IsInt()
  clientId: number;
}
