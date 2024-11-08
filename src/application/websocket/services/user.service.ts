import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRoomRepository: Repository<User>,
    ) {}

    async getUserById(user_id: string): Promise<User> {
        return await this.userRoomRepository.findOne({
            where: {
                id: user_id,
            },
        });
    }
}
