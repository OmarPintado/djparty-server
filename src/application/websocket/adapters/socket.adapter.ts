import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserSocket } from '../models/user.model';

@Injectable()
export class SocketAdapter {
    async emitAll(
        sockets: Array<UserSocket>,
        event: string,
        message: any,
    ): Promise<void> {
        for (let i = 0; i < sockets.length; i++)
            sockets[i].socket.emit(event, message);
    }

    async emitTo(
        sockets: Array<UserSocket>,
        to: Socket,
        event: string,
        message: any,
    ): Promise<void> {
        for (let i = 0; i < sockets.length; i++) {
            if (sockets[i].socket.id === to.id) {
                sockets[i].socket.emit(event, message);
                break;
            }
        }
    }

    async emitRoom(
        sockets: Array<UserSocket>,
        room_id: string,
        event: string,
        message: any,
    ) {
        for (let i = 0; i < sockets.length; i++) {
            if (
                sockets[i].current_room &&
                sockets[i].current_room === room_id
            ) {
                sockets[i].socket.emit(event, message);
            }
        }
    }
}
