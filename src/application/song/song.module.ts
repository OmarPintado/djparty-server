import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SongService } from './song.service';
import { GenreService } from './genre.service';
import { SongController } from './song.controller';
import {
    Artist,
    Genres,
    RoomState,
    Song,
    SongArtists,
    SongRequest,
    UserMusicRoom,
} from '../../domain/entities';

@Module({
    controllers: [SongController],
    providers: [SongService, GenreService],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            Artist,
            Genres,
            RoomState,
            Song,
            SongArtists,
            SongRequest,
            UserMusicRoom,
        ]),
    ],
})
export class SongModule {}
