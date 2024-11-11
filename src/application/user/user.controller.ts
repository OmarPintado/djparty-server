import {
    Body,
    Controller,
    Param,
    Patch,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { S3Service } from '../../infrastructure/shared/s3.service';
import { User } from '../../domain/entities';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { imageFilterHelper } from './helpers/imageFilter.helper';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly s3Service: S3Service,
    ) {}

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
        return this.userService.updateUser(id, updateUserDataDto, file);
    }
}
