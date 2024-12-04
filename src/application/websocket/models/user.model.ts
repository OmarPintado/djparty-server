import { Socket } from 'socket.io';

export interface UserSocket {
    id: string;
    fullName: string;
    isActive: boolean;
    url_profile: string | null

    socket: Socket;
    current_room: string;
}
