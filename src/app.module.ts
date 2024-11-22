import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './application/auth/auth.module';
import { MusicRoomModule } from './application/music-room/music-room.module';
import { SpotifyModule } from './application/spotify/spotify.module';
import * as entities from './domain/entities';
import { WebSocketModule } from './application/websocket/websocket.module';
import { SongModule } from './application/song/song.module';
import { UserModule } from './application/user/user.module';
import { UserFavoriteSongsModule } from './application/user-favorite-songs/user-favorite-songs.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            synchronize: true,
            ssl: {
                rejectUnauthorized:
                    process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            },
            entities: Object.values(entities),
        }),

        /*Application Modules*/
        AuthModule,
        MusicRoomModule,
        SongModule,
        SpotifyModule,
        UserModule,
        WebSocketModule,
        UserFavoriteSongsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
