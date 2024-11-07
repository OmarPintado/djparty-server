import { Logger, UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    SubscribeMessage,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAdapter } from './adapters/socket.adapter';
import { MusicRoom } from './models/music-room.model';
import { SongRequest } from 'src/domain/entities';
import { WsService } from './websocket.service';
import {SendMessageRoomDto} from "./dto"
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { AuthWS } from '../auth/decorators/authws.decorator';
import { RoleProtected } from '../auth/decorators/role-protected.decorator';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { UserRoleWsGuard } from '../auth/guards/user-role-ws.guard';
import { User } from './models/user.model';
import { SocketHandshakeDto } from './dto/socket-handshake.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private readonly socketAdapter: SocketAdapter,
        private readonly websocketService: WsService,
    ) {}

    private logger: Logger = new Logger("AppGateWay");
    private users: Array<User> = []

    @WebSocketServer()
    server: Server;

    handleConnection(socket: Socket) {
        const info = socket.handshake.query as any as SocketHandshakeDto
        if ( !info.fullName || info.fullName == "") {
            socket.emit("error", `Missing full name to connect`)
            socket.disconnect()
            return
        }

        this.users.push({
            socket: socket,
            fullName: info.fullName as string
        });

        this.logger.log('Client connected', socket.id);
    }

    handleDisconnect(socket: Socket) {
        this.users = this.users.filter(c => c.socket.id != socket.id)
        this.logger.log('Client disconnected', socket.id);
    }

    // Return all songrequest in a room
    @SubscribeMessage("getSongRequest")
    async getSongRequest(user: Socket) {
        const songRequests = await this.websocketService.getAllSongRequest()
        user.emit("getSongRequest", songRequests)
    }

    // Send songRequest to all user in a room
    @SubscribeMessage("sendSongRequest")
    async sendSongRequest(user: Socket, data: SongRequest ) {
        await this.socketAdapter.emitRoom(this.users, data.music_room_id, "sendSongRequest", data)
    }

    // Send songRequest 
    @SubscribeMessage("removeSongRequest")
    async removeSongRequest(user: Socket, data: SongRequest ) {
        await this.socketAdapter.emitRoom(this.users, data.music_room_id, "removeSongRequest", data)
    }

    @SubscribeMessage("selectedSongRequest")
    async selectedSongRequest(user: Socket, data: SongRequest ) {
        await this.socketAdapter.emitRoom(this.users, data.music_room_id, "selectedSongRequest", data)
    }

    @SubscribeMessage("sendMessageRoom")
    async sendMessageRoom(user: Socket, sendMessageRoomDto: SendMessageRoomDto) {
        const {room_id, data} = sendMessageRoomDto
        await this.socketAdapter.emitRoom(this.users, room_id, "sendMessageRoom", data);
    }

    @SubscribeMessage("getMusicRoom")
    async getMusicRoom(user: Socket, data: SongRequest) {
        const musicRooms = await this.websocketService.getAllMusicRoom()
        await user.emit("getMusicRoom", musicRooms)
    }

    @AuthWS(ValidRoles.dj)
    @SubscribeMessage("sendMusicRoom")
    async createRoom(user: Socket, data: SongRequest) {
        await this.socketAdapter.emitRoom(this.users, data.music_room_id, "sendMusicRoom", data);
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(socket: Socket, music_room_id: string) {
        const index = this.users.findIndex(u => u.socket.id == socket.id)
        this.users[index].current_room = music_room_id
        this.socketAdapter.emitRoom(this.users, music_room_id, 'joinRoom', `User ${this.users[index].fullName} joined to room`)
    }
}
