import { IsInt, IsNumber } from "class-validator";

export class CreateLoanDto {
    @IsNumber()
    amount: number;
  
    @IsInt()
    term: number;
  
    @IsNumber()
    interestRate: number;
  
    @IsInt()
    clientId: number;
  }
  