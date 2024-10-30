import { Module } from '@nestjs/common';
import { WSGateway } from './websocket.gateway';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRequest } from 'src/domain/entities';
import { SongRequestEvents } from './services/song-request.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([SongRequest])],
    providers: [WSGateway, SongRequestEvents],
})
export class WebSocketModule {}
