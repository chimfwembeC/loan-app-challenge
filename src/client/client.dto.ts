import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateClientDto {
    @IsString()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    nationalId: string;
  
    @IsPhoneNumber(null)
    phoneNumber: string;
  }