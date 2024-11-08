import {
    IsArray,
    IsNotEmpty,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ArtistDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    uri: string;
}

class AlbumDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    image: string;
}

export class SongRequestDto {
    @IsUUID()
    user_id: string;

    @IsString()
    spotify_track_id: string;

    @IsUUID()
    music_room_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArtistDto)
    artists: ArtistDto[];

    @ValidateNested()
    @Type(() => AlbumDto)
    album: AlbumDto;

    @IsNotEmpty()
    @IsString()
    name: string;
}
