import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

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

export class UpdateLoanDto {
  @ApiPropertyOptional({
    example: 6000,
    description: 'Updated loan amount',
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    example: 6.5,
    description: 'Updated interest rate',
  })
  @IsOptional()
  @IsNumber()
  interestRate?: number;

  @ApiPropertyOptional({
    example: 18,
    description: 'Updated term in months',
  })
  @IsOptional()
  @IsNumber()
  term?: number;

  @ApiPropertyOptional({
    example: 'closed',
    description: 'Loan status (active or closed)',
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'closed'])
  status?: string;
}
