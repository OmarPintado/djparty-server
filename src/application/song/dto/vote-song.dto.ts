import { IsUUID } from 'class-validator';

export class VoteSongDto {
  @IsUUID()
  song_id: string;

  @IsUUID()
  user_id: string;

  @IsUUID()
  music_room_id: string;
}
