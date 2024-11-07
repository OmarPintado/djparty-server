import {
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicRoom, SongRequest } from 'src/domain/entities';

@Injectable()
export class WsService {
    constructor(
        @InjectRepository(SongRequest)
        private readonly songRequestRepository: Repository<SongRequest>,

        @InjectRepository(MusicRoom)
        private readonly musicRoomRepository: Repository<MusicRoom>,
    ) {}

    async getAllSongRequest() : Promise<Array<SongRequest>> {
        return await this.songRequestRepository.find()
    }

    async getAllMusicRoom() : Promise<Array<MusicRoom>> {
        return await this.musicRoomRepository.find()
    }
}
