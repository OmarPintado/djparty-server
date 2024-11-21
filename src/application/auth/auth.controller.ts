import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    Response,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
    getProfile(@Request() req) {}

    @Get('google-redirect')
    @UseGuards(GoogleOAuthGuard)
    googleRedirect(@Request() req, @Response() res) {
        const user = this.authService.googleRedirect(req); 
        const script = `
            <script>
                window.opener.postMessage(${JSON.stringify(user)}, "*");
                window.close();
            </script>
        `;
        res.type('text/html');
        res.send(script);
    }
    
    @Post('google-auth')
    googleAuth(@Body() googleUserDto: LoginUserDto|CreateUserDto) {
        return this.authService.googleAuth(googleUserDto);
    }
}
