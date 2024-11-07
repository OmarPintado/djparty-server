import { Socket } from "socket.io";

export interface User {
    socket: Socket;
    fullName?: string;
    current_room?: string;
}