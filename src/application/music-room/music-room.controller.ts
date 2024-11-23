import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { MusicRoomService } from './music-room.service';
import { CreateMusicRoomDto } from './dto/create-music-room.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { JoinToRoomDTO } from './dto/join-to-room.dto';
import { JoinToRoomService } from './join-to-room.service';
import { UpdateMusicRoomDto } from './dto/update-music-room.dto';

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
    @Post('change-room-state/:id_room')
    changeRoomState(@Param('id_room') music_room_id: string, @Request() req) {
        console.log(req.user.id);
        return this.musicRoomService.changeRoomState(
            music_room_id,
            req.user.id,
        );
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

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Patch(':id')
    async updateRoom(
        @Param('id') id: string,
        @Body() updateMusicRoomDto: UpdateMusicRoomDto,
    ) {
        return await this.musicRoomService.updateRoom(id, updateMusicRoomDto);
    }
}
