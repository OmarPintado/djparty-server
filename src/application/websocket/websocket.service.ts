import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { SocketAdapter } from './adapters/socket.adapter';
import { UserService } from './services/user.service';
import { SongRequestService } from './services/song-request.service';
import { UserSocket } from './models/user.model';
import { SocketEvents } from './interfaces/socket-events';
import { SongRequestSocket } from './models/song-request.model';

@Injectable()
export class WsService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly songService: SongRequestService,
    ) {}

    async handleConnection(socket: Socket): Promise<UserSocket> {
        const token = socket.handshake.headers.authorization.split(' ')[1];
        const { user_id } = this.jwtService.decode(token);
        const user = await this.userService.getUserById(user_id);
        return {
            id: user.id,
            fullName: user.fullName,
            isActive: user.isActive,
            socket: socket,
        };
    }

    async handleDisconnect(socket: Socket): Promise<void> {}

    async getSongRequestList(music_room_id: string) {
        return await this.songService.getAllSongRequestByRoom(music_room_id);
    }

    async selectedSongRequest(song_request_id: string) {
        return await this.songService.getSongRequestbById(song_request_id);
    }
}
