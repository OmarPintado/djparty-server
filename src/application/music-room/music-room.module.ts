import { Module } from '@nestjs/common';
import { MusicRoomService } from './music-room.service';
import { MusicRoomController } from './music-room.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRoom, RoomState } from '../../domain/entities';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([MusicRoom, RoomState])],
    controllers: [MusicRoomController],
    providers: [MusicRoomService],
})
export class MusicRoomModule {}
