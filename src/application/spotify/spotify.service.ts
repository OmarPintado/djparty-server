import { Injectable } from '@nestjs/common';
import { SpotifyAdapter } from '../../infrastructure/adapters/spotify.adapter';
import { Track } from '../../domain/models/track.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Genres } from '../../domain/entities/genre.entity';
import { Repository } from 'typeorm';
import { MusicRoom, Song, SongRequest, User } from 'src/domain/entities';
import { SaveSongRequestDto } from './dto/save-song-request.dto';

@Injectable()
export class SpotifyService {
    constructor(
        private readonly spotifyAdapter: SpotifyAdapter,
        @InjectRepository(Genres)
        private readonly genresRepository: Repository<Genres>,
        @InjectRepository(SongRequest)
        private readonly songRequestRepository: Repository<SongRequest>,
    ) {}

    async searchSongs(query: string): Promise<Track[]> {
        const tracks = await this.spotifyAdapter.searchTracks(query);
        return tracks.map((track) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => ({
                name: artist.name,
                uri: artist.uri,
            })),
            album: {
                name: track.album.name,
                images: track.album.images,
            },
            popularity: track.popularity,
        }));
    }

    async executeGenreSeed(): Promise<any> {
        const genresToInsert: Genres[] = [];
        const genderList: { genres: string[] } =
            await this.spotifyAdapter.searchGender();

        genderList.genres.forEach((gender: string) => {
            const genreEntity = new Genres();
            genreEntity.genre = gender;
            genresToInsert.push(genreEntity);
        });

        await this.genresRepository.save(genresToInsert);

        return 'Genre Seed Executed!';
    }

    async saveSongRequest(data: SaveSongRequestDto): Promise<any> {
        const songRequest = new SongRequest()
        songRequest.user_id = data.user_id
        songRequest.music_room_id = data.music_room_id
        songRequest.song_id = data.song_id

        await this.songRequestRepository.save(songRequest)

        return 'Song Request Saved!'
    }
}
