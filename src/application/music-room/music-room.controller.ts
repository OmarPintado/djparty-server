import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

    @Auth(ValidRoles.user)
    @Get('popular-rooms')
    async popularRooms(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.musicRoomService.findAll(page, limit);
    }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Get('search')
    async searchRooms(
        @Query('query') query: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.musicRoomService.searchRooms(query, page, limit);
    }
}
