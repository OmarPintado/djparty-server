import { Body, Controller, Post } from '@nestjs/common';
import { MusicRoomService } from './music-room.service';
import { CreateMusicRoomDto } from './dto/create-music-room.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('music-room')
export class MusicRoomController {
    constructor(private readonly musicRoomService: MusicRoomService) {}

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Post('create')
    createRoom(@Body() createMusicRoomDto: CreateMusicRoomDto) {
        return this.musicRoomService.createRoom(createMusicRoomDto);
    }
}
