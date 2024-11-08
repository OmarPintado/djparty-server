import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist, Song, SongArtists, SongRequest } from '../../domain/entities';
import { SongRequestDto } from './dto/song-request.dto';

@Injectable()
export class SongService {
    private readonly logger = new Logger(SongService.name);

    constructor(
        @InjectRepository(SongRequest)
        private readonly songRequestRepository: Repository<SongRequest>,
        @InjectRepository(Song)
        private readonly songRepository: Repository<Song>,
        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>,
        @InjectRepository(SongArtists)
        private readonly songArtistsRepository: Repository<SongArtists>,
    ) {}

    async sendSongRequest(songRequestDto: SongRequestDto) {
        try {
            // Verificar si la canción ya está registrada en la base de datos
            let song = await this.songRepository.findOne({
                where: { id_track: songRequestDto.spotify_track_id },
            });

            if (!song) {
                // Insertar artistas
                const artists = await Promise.all(
                    songRequestDto.artists.map(async (artistDto) => {
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
                    id_track: songRequestDto.spotify_track_id,
                    title: songRequestDto.name,
                    image: songRequestDto.album.image,
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

            // Verificar si ya existe una solicitud de la misma canción por el mismo usuario en la misma sala
            const existingRequest = await this.songRequestRepository.findOne({
                where: {
                    song_id: song.id,
                    music_room_id: songRequestDto.music_room_id,
                    user_id: songRequestDto.user_id,
                },
            });

            if (existingRequest) {
                throw new BadRequestException(
                    'No puedes solicitar la misma canción dos veces en la misma sala.',
                );
            }

            // Registrar la solicitud de canción
            const songRequest = this.songRequestRepository.create({
                song_id: song.id,
                music_room_id: songRequestDto.music_room_id,
                user_id: songRequestDto.user_id,
                is_accepted: false,
            });
            await this.songRequestRepository.save(songRequest);

            return {
                message: `Canción enviada con éxito: ${song.title}`,
            };
        } catch (error) {
            this.logger.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Hubo un error al procesar la solicitud de canción. Por favor, intenta nuevamente más tarde.',
            );
        }
    }
}
