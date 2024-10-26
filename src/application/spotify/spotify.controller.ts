import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Track } from '../../domain/models/track.model';

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    @Get('search')
    async search(@Query('q') query: string): Promise<Track[]> {
        return this.spotifyService.searchSongs(query);
    }

    @Get('executeGenreSeed')
    async gender(): Promise<Track[]> {
        return this.spotifyService.executeGenreSeed();
    }
}
