import {
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
}
