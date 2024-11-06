import { Logger } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SongRequest } from 'src/application/websocket/domain/models/song-request.model';
import { SocketAdapter } from './infraestructure/adapters/socket.adapter';
import { MusicRoom } from './domain/models/music-room.model';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class WSGateway implements OnGatewayConnection{
    constructor(
        private readonly socketAdapter: SocketAdapter,
    ) {}

    private logger: Logger = new Logger("AppGateWay");
    private clients: Array<Socket> = []

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        this.logger.log('Client connected', client.id);
        this.clients.push(client)

        client.on('disconnect', () => {
            this.clients = this.clients.filter(c => c.id != client.id)
            this.logger.log('Client disconnected', client.id);
        });
    }

    @SubscribeMessage("sendSongRequest")
    async sendSongRequest(songRequest: SongRequest) {
        this.socketAdapter.emitAll(this.clients, "sendSongRequest", songRequest);
    }

    @SubscribeMessage("selectedSongRequest")
    async selectedSongRequest(songRequest: SongRequest) {
        this.socketAdapter.emitAll(this.clients, "selectedSongRequest", songRequest);
    }

    @SubscribeMessage("sendMessageRoom")
    async sendMessageRoom(message: string) {
        this.socketAdapter.emitAll(this.clients, "sendMessageRoom", message);
    }

    @SubscribeMessage("createRoom")
    async createRoom(musicroom: MusicRoom) {
        this.socketAdapter.emitAll(this.clients, "createRoom", musicroom);
    }
}
