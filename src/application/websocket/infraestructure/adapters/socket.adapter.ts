import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketAdapter {
    async emitAll(sockets: Array<Socket>, event: string,  message: any): Promise<void> {
        for (let i = 0; i < sockets.length; i++) 
            sockets[i].emit(event, message);
    }

    async emitTo(sockets: Array<Socket>, to: Socket, event: string,  message: any): Promise<void> {
        for (let i = 0; i < sockets.length; i++)  {
            if (sockets[i].id === to.id) {
                sockets[i].emit(event, message);
                break;
            }
        }
    }
}
