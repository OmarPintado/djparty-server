import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { imageFilterHelper } from './helpers/imageFilter.helper';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { RemoveUserRoomDto } from './dto/remove-user-room.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: imageFilterHelper, // Only valid image extensions
            limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit
        }),
    )
    async updateUser(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateUserDataDto: UpdateUserDataDto,
    ) {
        return await this.userService.updateUser(id, updateUserDataDto, file);
    }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Post('ban')
    async banUserFromRoom(@Body() banUserDto: BanUserDto) {
        return await this.userService.banUserFromRoom(banUserDto);
    }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Get(":id/historial")
    async getHistorialRoom(@Param() id: string) {
        return await this.userService.findOne(id);
    }

    @Auth(ValidRoles.user, ValidRoles.dj)
    @Post("remove-room")
    async removeRoom(@Body() removeUserRoomDto: RemoveUserRoomDto) {
        return await this.userService.removeUserRoom(removeUserRoomDto)
    }
}
