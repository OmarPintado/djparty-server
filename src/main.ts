import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';
import { GoogleStrategy } from './application/auth/strategies/google.oauth';
import { AuthService } from './application/auth/auth.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
