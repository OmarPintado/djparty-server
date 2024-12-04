import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SongService } from './song.service';
import { SongRequestDto } from './dto/song-request.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { GenreService } from './genre.service';
import { VoteSongDto } from './dto/vote-song.dto';

@Controller('song')
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly genreService: GenreService,
    ) {}

    @Auth(ValidRoles.user)
    @Post('send-song-request')
    async requestSong(@Body() songRequestDto: SongRequestDto) {
        return await this.songService.sendSongRequest(songRequestDto);
    }

    @Get('genres')
    async genresList(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.genreService.findAll(page, limit);
    }

    @Get('genres/search')
    async searchGenres(
        @Query('name') name: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.genreService.findByName(name, page, limit);
    }

    @Auth(ValidRoles.user)
    @Post('vote')
    async voteSong(@Body() voteSongDto: VoteSongDto) {
        return await this.songService.voteForSong(voteSongDto);
    }
}
