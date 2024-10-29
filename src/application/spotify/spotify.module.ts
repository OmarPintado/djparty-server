import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { SpotifyAdapter } from '../../infrastructure/adapters/spotify.adapter';
import { Genres } from '../../domain/entities';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Genres])],
    controllers: [SpotifyController],
    providers: [SpotifyService, SpotifyAdapter],
})
export class SpotifyModule {}
