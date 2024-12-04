import { Module } from '@nestjs/common';
import { MusicRoomService } from './music-room.service';
import { MusicRoomController } from './music-room.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRoom, RoomState, UserMusicRoom } from '../../domain/entities';
import { JoinToRoomService } from './join-to-room.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { S3Service } from '../../infrastructure/shared/s3.service';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([MusicRoom, RoomState, UserMusicRoom]),
    ],
    controllers: [MusicRoomController],
    providers: [MusicRoomService, JoinToRoomService, JwtStrategy, S3Service],
})
export class MusicRoomModule {}
