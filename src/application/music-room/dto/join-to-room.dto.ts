import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinToRoomDTO {
    @IsUUID()
    @IsNotEmpty()
    user_id;

    @IsUUID()
    @IsNotEmpty()
    music_room_id;
}
