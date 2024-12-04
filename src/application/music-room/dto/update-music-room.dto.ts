import {
    IsBoolean,
    IsNotEmpty,
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
    @IsString()
    is_private: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    image_url: string;

    @IsNotEmpty()
    @IsString()
    start_date: Date;

}
