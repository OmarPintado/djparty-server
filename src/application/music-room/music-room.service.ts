import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicRoom, RoomState, User } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateMusicRoomDto } from './dto/create-music-room.dto';

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
    ) {}

    async createRoom(createMusicRoomDto: CreateMusicRoomDto) {
        const { created_by } = createMusicRoomDto;

        const user = await this.userRepository.findOne({
            where: { id: created_by },
        });
        if (!user) {
            this.logger.error(`User with ID ${created_by} not found`);
            throw new NotFoundException(`User with ID ${created_by} not found`);
        }

        return await this.musicRoomRepository.manager.transaction(
            async (entityManager: EntityManager) => {
                try {
                    const musicRoom = entityManager.create(
                        MusicRoom,
                        createMusicRoomDto,
                    );
                    const savedRoom = await entityManager.save(
                        MusicRoom,
                        musicRoom,
                    );
                    this.logger.log('Music room created successfully');

                    const roomState = entityManager.create(RoomState, {
                        is_open: false,
                        music_room: savedRoom,
                    });

                    await entityManager.save(RoomState, roomState);
                    this.logger.log('Room state created successfully');

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
}
