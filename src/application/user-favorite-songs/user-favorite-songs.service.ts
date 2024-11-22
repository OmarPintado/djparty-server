import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Artist,
    Song,
    SongArtists,
    User,
    UserFavoriteSongs,
} from '../../domain/entities';
import { AddFavoriteSongDto } from './dto/add-favorite-song.dto';

@Injectable()
export class UserFavoriteSongsService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
        @InjectRepository(UserFavoriteSongs)
        private userFavoriteSongsRepository: Repository<UserFavoriteSongs>,
        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>,
        @InjectRepository(SongArtists)
        private readonly songArtistsRepository: Repository<SongArtists>,
    ) {}

    async addFavoriteSong(
        addFavoriteSongDto: AddFavoriteSongDto,
    ): Promise<UserFavoriteSongs> {
        const { user_id, spotify_track_id } = addFavoriteSongDto;

        const user = await this.userRepository.findOne({
            where: { id: user_id },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        let song = await this.songRepository.findOne({
            where: { id_track: spotify_track_id },
        });

        if (!song) {
            // Insertar artistas
            const artists = await Promise.all(
                addFavoriteSongDto.artists.map(async (artistDto) => {
                    let artist = await this.artistRepository.findOne({
                        where: { uri: artistDto.uri },
                    });
                    if (!artist) {
                        artist = this.artistRepository.create({
                            artist: artistDto.name,
                            uri: artistDto.uri,
                        });
                        artist = await this.artistRepository.save(artist);
                    }
                    return artist;
                }),
            );

            // Insertar canción
            song = this.songRepository.create({
                id_track: spotify_track_id,
                title: addFavoriteSongDto.name,
                image: addFavoriteSongDto.album.image,
            });
            song = await this.songRepository.save(song);

            // Registrar la relación entre la canción y los artistas
            await Promise.all(
                artists.map(async (artist) => {
                    const songArtist = this.songArtistsRepository.create({
                        id_artist: artist.id,
                        id_song: song.id,
                    });
                    await this.songArtistsRepository.save(songArtist);
                }),
            );
        }

        const existingFavorite = await this.userFavoriteSongsRepository.findOne(
            {
                where: {
                    user: user,
                    song: song,
                },
            },
        );

        if (existingFavorite) {
            throw new ConflictException(
                'La canción ya está en la lista de favoritos',
            );
        }

        const favoriteSong = this.userFavoriteSongsRepository.create({
            user: user,
            song: song,
        });

        return this.userFavoriteSongsRepository.save(favoriteSong);
    }

    // Obtener las canciones favoritas de un usuario
    async getFavoriteSongs(userId: string): Promise<Song[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const favoriteSongsQuery = await this.userFavoriteSongsRepository
            .createQueryBuilder('ufs')
            .innerJoinAndSelect('ufs.song', 'song')
            .leftJoinAndSelect('song.artistSongs', 'songArtist')
            .leftJoinAndSelect('songArtist.artist', 'artist')
            .where('ufs.user = :userId', { userId })
            .getMany();

        return favoriteSongsQuery.map((favorite) => {
            const artists = favorite.song.artistSongs.map(
                (songArtist) => songArtist.artist,
            );

            return {
                ...favorite.song,
                artists,
                artistSongs: undefined,
            };
        });
    }

    // Eliminar una canción de la lista de favoritos de un usuario
    async removeFavoriteSong(userId: string, songId: string): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const song = await this.songRepository.findOne({
            where: { id: songId },
        });

        if (!user || !song) {
            throw new Error('Usuario o canción no encontrados');
        }

        const favoriteSong = await this.userFavoriteSongsRepository.findOne({
            where: { user, song },
        });

        if (!favoriteSong) {
            throw new NotFoundException(
                'La canción no está en la lista de favoritos',
            );
        }

        await this.userFavoriteSongsRepository.remove(favoriteSong);
    }
}
