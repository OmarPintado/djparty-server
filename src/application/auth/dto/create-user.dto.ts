import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(4)
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(50)
    password: string;

    @IsString()
    @MinLength(5)
    fullName: string;
}
