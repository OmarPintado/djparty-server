import { Injectable } from '@nestjs/common';
import { SpotifyAdapter } from '../../infrastructure/adapters/spotify.adapter';
import { Track } from '../../domain/models/track.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Genres } from '../../domain/entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpotifyService {
    constructor(
        private readonly spotifyAdapter: SpotifyAdapter,
        @InjectRepository(Genres)
        private readonly genresRepository: Repository<Genres>,
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
}
