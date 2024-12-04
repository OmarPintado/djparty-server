import {
    IsBoolean,
    IsDate,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class UpdateMusicRoomDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    is_private: boolean;

    @IsOptional()
    @IsString()
    password: string;
}
