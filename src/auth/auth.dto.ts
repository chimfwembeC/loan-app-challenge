import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}