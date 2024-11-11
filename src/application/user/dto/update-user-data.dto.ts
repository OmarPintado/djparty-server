import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDataDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email address' })
    email?: string;

    @IsOptional()
    @IsString()
    url_profile?: string;
}
