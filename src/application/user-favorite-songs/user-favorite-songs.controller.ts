import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserFavoriteSongsService } from './user-favorite-songs.service';
import { AddFavoriteSongDto } from './dto/add-favorite-song.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('user-favorite-songs')
export class UserFavoriteSongsController {
    constructor(
        private readonly userFavoriteSongsService: UserFavoriteSongsService,
    ) {}

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Post('add')
    async addFavorite(@Body() addFavoriteSongDto: AddFavoriteSongDto) {
        return this.userFavoriteSongsService.addFavoriteSong(
            addFavoriteSongDto,
        );
    }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Get('list/:userId')
    async getFavoriteSongs(@Param('userId') userId: string) {
        return this.userFavoriteSongsService.getFavoriteSongs(userId);
    }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Delete('remove/:userId/:songId')
    async removeFavorite(
        @Param('userId') userId: string,
        @Param('songId') songId: string,
    ) {
        return this.userFavoriteSongsService.removeFavoriteSong(userId, songId);
    }
}
