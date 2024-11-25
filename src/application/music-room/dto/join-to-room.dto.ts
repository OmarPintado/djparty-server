import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class JoinToRoomDTO {
    @IsUUID()
    @IsNotEmpty()
    user_id;

    @IsUUID()
    @IsNotEmpty()
    music_room_id;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password?: string;
}
