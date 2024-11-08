import { Body, Controller, Post } from '@nestjs/common';
import { SongService } from './song.service';
import { SongRequestDto } from './dto/song-request.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('song')
export class SongController {
    constructor(private readonly songService: SongService) {}

    @Auth(ValidRoles.user)
    @Post('send-song-request')
    async requestSong(@Body() songRequestDto: SongRequestDto) {
        return await this.songService.sendSongRequest(songRequestDto);
    }
}
