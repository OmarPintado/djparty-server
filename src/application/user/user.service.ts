import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicRoom, User, UserMusicRoom } from '../../domain/entities';
import { Repository } from 'typeorm';
import { S3Service } from '../../infrastructure/shared/s3.service';
import { BanUserDto } from './dto/ban-user.dto';
import { RemoveUserRoomDto } from './dto/remove-user-room.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserMusicRoom)
        private readonly userMusicRoomRepository: Repository<UserMusicRoom>,

        @InjectRepository(MusicRoom)
        private readonly musicRoomRepository: Repository<MusicRoom>,

        private readonly s3Service: S3Service,
    ) { }

    async removeUserRoom(removeUserRoomDto: RemoveUserRoomDto) {
        const { userId, roomId } = removeUserRoomDto;

        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        await this.musicRoomRepository.delete({
            id: roomId,
        });
    }

    async getHistorialRoom(created_by: string): Promise<MusicRoom[]> {
        const user = await this.userRepository.findOne({
            where: { id: created_by },
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return await this.musicRoomRepository.find({
            where: { created_by }
        })
    }

    async banUserFromRoom(banUserDto: BanUserDto) {
        const { userId, roomId } = banUserDto;

        const room = await this.musicRoomRepository.findOne({
            where: { id: roomId },
        });

        if (!room) {
            throw new NotFoundException('Room not found.');
        }

        if (room.created_by === userId) {
            throw new ForbiddenException('Cannot ban the creator of the room.');
        }

        const userMusicRoom = await this.userMusicRoomRepository.findOne({
            where: { user_id: userId, music_room_id: roomId },
        });

        if (!userMusicRoom) {
            throw new NotFoundException(
                'User is not in this room or does not exist.',
            );
        }

        userMusicRoom.is_banned = true;

        await this.userMusicRoomRepository.save(userMusicRoom);

        return {
            message: 'User has been banned from the room successfully.',
            userMusicRoom: userMusicRoom,
        };
    }

    async updateUser(
        id: string,
        updateUserData: Partial<User>,
        file?: Express.Multer.File,
    ): Promise<User> {
        const existingUser = await this.findOne(id);
        if (file) {
            if (existingUser.url_profile) {
                const fileKey = existingUser.url_profile.split('/').pop();
                await this.s3Service.deleteFile(fileKey);
            }
            updateUserData.url_profile = await this.s3Service.uploadFile(file);
        }

        await this.userRepository.update(id, {
            ...existingUser,
            ...updateUserData,
        });
        const updatedUser = await this.userRepository.findOneBy({ id });
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}
