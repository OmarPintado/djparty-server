import { Socket } from 'socket.io';

export interface UserSocket {
    id: string;
    fullName: string;
    isActive: boolean;

    socket: Socket;
    current_room: string;
}
