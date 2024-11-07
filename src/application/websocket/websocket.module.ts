import { Module } from '@nestjs/common';
import { WSGateway } from './websocket.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRoom, SongRequest, User } from 'src/domain/entities';
import { SocketAdapter } from './infraestructure/adapters/socket.adapter';
import { PassportModule } from '@nestjs/passport';
import { WsService } from './websocket.service';
import { WsStrategy } from '../auth/strategies/ws.strategy';
import { MusicRoomEvent } from './infraestructure/events/music-room.event';

@Module({
    imports: [
        ConfigModule, 
        TypeOrmModule.forFeature([SongRequest, MusicRoom, User]), 
        PassportModule.register({defaultStrategy: "custom"}),
    ],
    providers: [WsService, WSGateway , SocketAdapter, WsStrategy, MusicRoomEvent],
})
export class WebSocketModule {}
