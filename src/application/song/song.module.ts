import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Artist,
    RoomState,
    Song,
    SongArtists,
    SongRequest,
    UserMusicRoom,
} from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [SongController],
    providers: [SongService],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            Song,
            SongRequest,
            Artist,
            SongArtists,
            UserMusicRoom,
            RoomState,
        ]),
    ],
})
export class SongModule {}
