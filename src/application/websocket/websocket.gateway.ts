import { Logger } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    SubscribeMessage,
    MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SongRequestServices } from './services/song-request.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class WSGateway implements OnGatewayConnection{
    private logger: Logger = new Logger("AppGateWay");

    @WebSocketServer()
    server: Server;

    constructor(private songRequestService: SongRequestServices) {}
    
    handleConnection(client: Socket) {
        this.logger.log('Client connected', client.id);

        client.on('disconnect', () => {
            this.logger.log('Client disconnected', client.id);
        });
    }

    @SubscribeMessage("getsongrequest")
    async handleGetSongRequest(client: Socket ) {
        const songRequests = this.songRequestService.handleGetSongRequest();
        client.emit('getsongrequest', songRequests);
    }
}
