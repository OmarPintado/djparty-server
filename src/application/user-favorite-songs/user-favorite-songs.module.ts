import { Module } from '@nestjs/common';
import { UserFavoriteSongsService } from './user-favorite-songs.service';
import { UserFavoriteSongsController } from './user-favorite-songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Artist,
    Song,
    SongArtists,
    User,
    UserFavoriteSongs,
} from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            User,
            Song,
            UserFavoriteSongs,
            Artist,
            SongArtists,
        ]),
    ],
    controllers: [UserFavoriteSongsController],
    providers: [UserFavoriteSongsService],
})
export class UserFavoriteSongsModule {}
