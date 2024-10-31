import { IsNotEmpty, IsUUID } from "class-validator"

export class SaveSongRequestDto {
    @IsNotEmpty()
    @IsUUID()
    user_id: string
    
    @IsNotEmpty()
    @IsUUID()
    music_room_id: string
    
    @IsNotEmpty()
    @IsUUID()
    song_id: string
}