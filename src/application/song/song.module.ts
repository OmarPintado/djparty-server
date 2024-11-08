import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist, Song, SongArtists, SongRequest } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [SongController],
    providers: [SongService],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Song, SongRequest, Artist, SongArtists]),
    ],
})
export class SongModule {}
