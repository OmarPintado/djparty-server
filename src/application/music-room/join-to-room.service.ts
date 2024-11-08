import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMusicRoom } from '../../domain/entities';
import { Repository } from 'typeorm';
import { JoinToRoomDTO } from './dto/join-to-room.dto';

@Injectable()
export class JoinToRoomService {
    private readonly logger = new Logger(JoinToRoomService.name);

    constructor(
        @InjectRepository(UserMusicRoom)
        private readonly userMusicRoomRepository: Repository<UserMusicRoom>,
    ) {}

    async joinToRoom(joinToRoomDTO: JoinToRoomDTO) {
        const { user_id, music_room_id } = joinToRoomDTO;

        // Verificar si el usuario ya está en la sala
        const existingUserInRoom = await this.userMusicRoomRepository.findOne({
            where: { user_id, music_room_id: music_room_id },
        });

        if (existingUserInRoom) {
            throw new BadRequestException(
                'Ya estás dentro de esta sala de música.',
            );
        }

        // Crear la nueva relación usuario-sala
        const userMusicRoom = this.userMusicRoomRepository.create({
            user_id,
            music_room_id,
        });

        try {
            // Guardar la nueva relación en la base de datos
            await this.userMusicRoomRepository.save(userMusicRoom);
            this.logger.log(
                `El usuario ${user_id} se unió a la sala ${music_room_id}`,
            );
            return { message: '¡Te uniste a la sala!' };
        } catch (error) {
            this.logger.error(
                `No se pudo agregar al usuario ${user_id} a la sala ${music_room_id}`,
                error,
            );
            throw new BadRequestException(
                'No se pudo agregar al usuario a la sala.',
            );
        }
    }
}
