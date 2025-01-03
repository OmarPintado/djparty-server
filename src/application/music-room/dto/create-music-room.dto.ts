import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from 'class-validator';

export class CreateMusicRoomDto {
    @IsNotEmpty()
    @IsUUID()
    created_by: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    is_private: string;

    @IsNotEmpty()
    @IsString()
    start_date: Date;

    @IsOptional()
    @IsString()
    password?: string;
}
