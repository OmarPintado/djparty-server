import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongRequest } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SongRequestService {
    constructor(
        @InjectRepository(SongRequest)
        private readonly songRequestRepository: Repository<SongRequest>,
    ) {}

    async getAllSongRequestByRoom(
        music_room_id: string,
    ): Promise<Array<SongRequest>> {
        return await this.songRequestRepository.find({
            where: {
                music_room_id: music_room_id,
            },
            relations: ['song', 'song.artistSongs.artist']
        });
    }

    async getSongRequestById(song_id: string): Promise<{ id_track: string }> {
        const songRequest = await this.songRequestRepository.findOne({
            where: {
                song_id,
            },
            relations: ['song'],
        });

        if (!songRequest) {
            throw new Error('SongRequest not found');
        }

        return { id_track: songRequest.song.id_track };
    }
}
