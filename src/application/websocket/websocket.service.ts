import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserService } from './services/user.service';
import { SongRequestService } from './services/song-request.service';
import { UserSocket } from './models/user.model';

@Injectable()
export class WsService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly songService: SongRequestService,
    ) {}

    async handleConnection(socket: Socket): Promise<UserSocket> {
        const token = socket.handshake.headers.authorization.split(' ')[1];
        const { user_id } = await this.jwtService.decode(token);
        const music_room_id = socket.handshake.query.music_room_id as string | undefined;
        if (!music_room_id) {
            throw new Error(`User must to be in any music room`)
        }

        const user = await this.userService.getUserById(user_id);
        return {
            ...user,
            current_room: music_room_id,
            socket: socket,
        };
    }

    async handleDisconnect(socket: Socket): Promise<void> {}

    async getSongRequestList(music_room_id: string) {
        return await this.songService.getAllSongRequestByRoom(music_room_id);
    }

    async selectedSongRequest(song_request_id: string) {
        return await this.songService.getSongRequestById(song_request_id);
    }
}
