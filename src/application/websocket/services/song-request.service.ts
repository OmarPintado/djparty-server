import { InjectRepository } from "@nestjs/typeorm";
import { SongRequest } from "src/domain/entities";
import { Repository } from "typeorm";

export class SongRequestServices {
    constructor(@InjectRepository(SongRequest)
    private songRequestRepository: Repository<SongRequest>) {}

    async handleGetSongRequest(): Promise<Array<SongRequest> | null> {
        const songRequests = await this.songRequestRepository.find()
        if (!songRequests) return null
        return null
    }
}