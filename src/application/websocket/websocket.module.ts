import { Module } from '@nestjs/common';
import { WSGateway } from './websocket.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRoom, SongRequest, User } from 'src/domain/entities';
import { SocketAdapter } from './adapters/socket.adapter';
import { PassportModule } from '@nestjs/passport';
import { WsService } from './websocket.service';
import { WsStrategy } from '../auth/strategies/ws.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { SongRequestService } from './services/song-request.service';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([SongRequest, MusicRoom, User]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [
        WsService,
        WSGateway,
        SocketAdapter,
        WsStrategy,
        JwtService,
        UserService,
        SongRequestService,
    ],
})
export class WebSocketModule {}
