import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('google')
    @UseGuards(GoogleOAuthGuard)
    getProfile(@Request() req) { }

    @Get('google-redirect')
    @UseGuards(GoogleOAuthGuard)
    async googleRedirect(@Request() req) {
        const user: CreateUserDto = req.user
        return await this.authService.oauthCreate(user)
    }
}
