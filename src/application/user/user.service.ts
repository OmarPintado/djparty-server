import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities';
import { Repository } from 'typeorm';
import { S3Service } from '../../infrastructure/shared/s3.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly s3Service: S3Service,
    ) {}

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
