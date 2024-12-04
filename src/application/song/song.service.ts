import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Artist,
    RoomState,
    Song,
    SongArtists,
    SongRequest,
    UserMusicRoom,
} from '../../domain/entities';
import { SongRequestDto } from './dto/song-request.dto';
import { VoteSongDto } from './dto/vote-song.dto';

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
        @InjectRepository(UserMusicRoom)
        private readonly userMusicRoomRepository: Repository<UserMusicRoom>,
        @InjectRepository(RoomState)
        private readonly roomStateRepository: Repository<RoomState>,
    ) {}

    async sendSongRequest(songRequestDto: SongRequestDto) {
        try {
            const { user_id, music_room_id } = songRequestDto;

            // Verificar si la sala de música está activa
            await this.validateRoomIsActive(music_room_id);

            // Verificar si el usuario pertenece a la sala y que no esté baneado
            await this.validateUserInRoomAndNotBanned(user_id, music_room_id);

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

    // Nueva función para votar por una canción
    async voteForSong(voteSongDto: VoteSongDto) {
        const { song_id, user_id, music_room_id } = voteSongDto;
        try {
            // Verificar si la sala de música está activa
            await this.validateRoomIsActive(music_room_id);

            // Verificar si el usuario pertenece a la sala y que no esté baneado
            await this.validateUserInRoomAndNotBanned(user_id, music_room_id);

            // Verificar si el usuario ya ha solicitado la canción en la sala
            const existingRequest = await this.songRequestRepository.findOne({
                where: {
                    song_id: song_id,
                    user_id: user_id,
                    music_room_id: music_room_id,
                },
            });

            if (existingRequest) {
                throw new BadRequestException('Ya tienes una solicitud de esta canción registrada en esta sala.');
            }

            // Verificar si la canción existe en la base de datos
            const song = await this.songRepository.findOne({
                where: { id: song_id },
            });

            if (!song) {
                throw new BadRequestException('La canción no existe en la base de datos.');
            }

            // Registrar la solicitud de canción
            const songRequest = this.songRequestRepository.create({
                song_id: song.id,
                music_room_id: music_room_id,
                user_id: user_id,
                is_accepted: false,
            });

            await this.songRequestRepository.save(songRequest);

            return {
                message: `Voto registrado correctamente para la canción: ${song.title}`,
            };

        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(`${error.message}`);
        }
    }

    private async validateUserInRoomAndNotBanned(
        user_id: string,
        music_room_id: string,
    ) {
        // Verificar si el usuario pertenece a la sala
        const userMusicRoom = await this.userMusicRoomRepository.findOne({
            where: { user_id, music_room_id },
        });

        if (!userMusicRoom) {
            throw new BadRequestException(
                'No estás dentro de esta sala de música.',
            );
        }

        // Verificar si el usuario está baneado de la sala
        if (userMusicRoom.is_banned) {
            throw new BadRequestException('Fuiste baneado de esta sala. :(');
        }

        return true; // El usuario pertenece a la sala y no está baneado
    }

    private async validateRoomIsActive(music_room_id: string) {
        // Verificar si la sala está activa (is_open = true)
        const roomState = await this.roomStateRepository.findOne({
            where: { music_room: { id: music_room_id } },
        });

        if (!roomState || !roomState.is_open) {
            throw new BadRequestException('La sala de música no está activa.');
        }

        return true; // La sala está activa
    }
}
