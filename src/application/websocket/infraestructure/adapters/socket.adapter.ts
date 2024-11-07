import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../../domain/models/user.model';

@Injectable()
export class SocketAdapter {
    async emitAll(sockets: Array<User>, event: string,  message: any): Promise<void> {
        for (let i = 0; i < sockets.length; i++) 
            sockets[i].socket.emit(event, message);
    }

    async emitTo(sockets: Array<User>, to: Socket, event: string,  message: any): Promise<void> {
        for (let i = 0; i < sockets.length; i++)  {
            if (sockets[i].socket.id === to.id) {
                sockets[i].socket.emit(event, message);
                break;
            }
        }
    }

    async emitRoom(sockets: Array<User>, room_id: string, event: string, message: any) {
        for (let i = 0; i < sockets.length; i++) {
            if (sockets[i].current_room && sockets[i].current_room === room_id) {
                sockets[i].socket.emit(event, message);
            }
        }
    }
}
