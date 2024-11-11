import { Body, Controller, Post } from '@nestjs/common';
import { MusicRoomService } from './music-room.service';
import { CreateMusicRoomDto } from './dto/create-music-room.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { JoinToRoomDTO } from './dto/join-to-room.dto';
import { JoinToRoomService } from './join-to-room.service';

@Controller('music-room')
export class MusicRoomController {
    constructor(
        private readonly musicRoomService: MusicRoomService,
        private readonly joinToRoomService: JoinToRoomService,
    ) {}

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Post('create')
    createRoom(@Body() createMusicRoomDto: CreateMusicRoomDto) {
        return this.musicRoomService.createRoom(createMusicRoomDto);
    }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Post('join')
    async joinRoom(@Body() joinToRoomDTO: JoinToRoomDTO) {
        return await this.joinToRoomService.joinToRoom(joinToRoomDTO);
    }
}
