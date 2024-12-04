import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    MusicRoom,
    RoomState,
    User,
    UserMusicRoom,
} from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateMusicRoomDto } from './dto/create-music-room.dto';
import { UpdateMusicRoomDto } from './dto/update-music-room.dto';
import { S3Service } from '../../infrastructure/shared/s3.service';

@Injectable()
export class MusicRoomService {
    private readonly logger = new Logger(MusicRoomService.name);

    constructor(
        @InjectRepository(MusicRoom)
        private readonly musicRoomRepository: Repository<MusicRoom>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(RoomState)
        private readonly roomStateRepository: Repository<RoomState>,
        @InjectRepository(UserMusicRoom)
        private readonly userMusicRoomRepository: Repository<UserMusicRoom>,

        private readonly s3Service: S3Service,
    ) {}
    async findRoomsByUser(userId: string): Promise<MusicRoom[]> {
        return await this.musicRoomRepository.find({
            where: {
                created_by: userId,
            },
        });
    }

    async createRoom(
        createMusicRoomDto: CreateMusicRoomDto,
        file?: Express.Multer.File,
    ) {
        const { created_by, password, is_private } = createMusicRoomDto;

        const user = await this.userRepository.findOne({
            where: { id: created_by },
        });
        if (!user) {
            this.logger.error(`User with ID ${created_by} not found`);
            throw new NotFoundException(`User with ID ${created_by} not found`);
        }

        if (is_private && !password) {
            throw new BadRequestException(
                'Se requiere una contraseña para una sala privada.',
            );
        }

        return await this.musicRoomRepository.manager.transaction(
            async (entityManager: EntityManager) => {
                try {
                    // Crear instancia de MusicRoom con el DTO completo
                    const musicRoom = entityManager.create(
                        MusicRoom,
                        createMusicRoomDto,
                    );

                    if (file) {
                        musicRoom.image_url =
                            await this.s3Service.uploadFile(file);
                    }

                    const savedRoom = await entityManager.save(
                        MusicRoom,
                        musicRoom,
                    );
                    this.logger.log('Music room created successfully');

                    // Crear instancia de RoomState asociada a la sala
                    const roomState = entityManager.create(RoomState, {
                        is_open: false,
                        music_room: savedRoom,
                    });

                    await entityManager.save(RoomState, roomState);
                    this.logger.log('Room state created successfully');

                    // Agregar usuario a la sala
                    const userMusicRoom = entityManager.create(UserMusicRoom, {
                        user_id: created_by,
                        music_room_id: savedRoom.id,
                    });
                    await entityManager.save(UserMusicRoom, userMusicRoom);
                    this.logger.log(`User ${created_by} added to the room`);

                    return savedRoom;
                } catch (error) {
                    this.logger.error(
                        `Error creating music room: ${error.message}`,
                        error.stack,
                    );
                    throw new Error(
                        `Error creating music room: ${error.message}`,
                    );
                }
            },
        );
    }

    //Get more popular rooms
    async findAll(page: number, limit: number): Promise<MusicRoom[]> {
        return await this.musicRoomRepository
            .createQueryBuilder('musicRoom')
            .leftJoin('musicRoom.userMusicRooms', 'userMusicRoom')
            .leftJoin('userMusicRoom.user', 'user')
            .select('musicRoom.id', 'id')
            .addSelect('musicRoom.name', 'name')
            .addSelect('musicRoom.description', 'description')
            .addSelect('musicRoom.is_private', 'is_private')
            .addSelect('COUNT(DISTINCT user.id) AS userCount')
            .groupBy('musicRoom.id')
            .orderBy('userCount', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getRawMany();
    }

    async searchRooms(
        query: string,
        page: number,
        limit: number,
    ): Promise<MusicRoom[]> {
        return await this.musicRoomRepository
            .createQueryBuilder('musicRoom')
            .where(
                'LOWER(musicRoom.name) LIKE LOWER(:query) OR LOWER(musicRoom.description) LIKE LOWER(:query)',
                {
                    query: `%${query.toLowerCase()}%`,
                },
            )
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
    }

    async updateRoom(
        music_room_id: string,
        updateMusicRoomDto: UpdateMusicRoomDto,
        file?: Express.Multer.File,
    ) {
        const musicRoom = await this.musicRoomRepository.findOne({
            where: { id: music_room_id },
        });

        if (!musicRoom) {
            this.logger.error(`Music room with ID ${music_room_id} not found`);
            throw new NotFoundException(
                `Music room with ID ${music_room_id} not found`,
            );
        }

        if (file) {
            if (musicRoom.image_url) {
                const fileKey = musicRoom.image_url.split('/').pop();
                await this.s3Service.deleteFile(fileKey);
            }
            musicRoom.image_url = await this.s3Service.uploadFile(file);
        }

        await this.musicRoomRepository.update(music_room_id, {
            ...musicRoom,
            ...updateMusicRoomDto,
        });

        return await this.musicRoomRepository.findOne({
            where: { id: music_room_id },
        });
    }

    async changeRoomState(music_room_id: string, user_id: string) {
        const musicRoom = await this.musicRoomRepository.findOne({
            where: { id: music_room_id },
        });

        if (!musicRoom) {
            throw new Error('La sala de música no existe');
        }

        if (musicRoom.created_by !== user_id) {
            throw new UnauthorizedException(
                'Solo el creador de la sala puede cambiar su estado',
            );
        }

        let roomState = await this.roomStateRepository.findOne({
            where: { music_room: { id: music_room_id } },
        });

        roomState.is_open = !roomState.is_open;

        await this.roomStateRepository.save(roomState);

        return `La sala ${musicRoom.name} ha sido cambiado a ${roomState.is_open ? 'abierto' : 'cerrado'}`;
    }

    async findRoom(id: string): Promise<MusicRoom> {
        return await this.musicRoomRepository.findOne({
            where: {
                id,
            },
        });
    }
}
