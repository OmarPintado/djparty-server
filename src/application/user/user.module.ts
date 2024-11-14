import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRoom, User, UserMusicRoom } from '../../domain/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { S3Service } from '../../infrastructure/shared/s3.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserMusicRoom, MusicRoom])],
    controllers: [UserController],
    providers: [UserService, S3Service],
})
export class UserModule {}
