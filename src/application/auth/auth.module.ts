import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { BcryptAdapter } from '../../infrastructure/adapters/bcrypt.adapter';
import { AuthController } from './auth.controller';
import { User } from '../../domain/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

import { GoogleStrategy } from './strategies/google.oauth';
import { MailerModule } from '../mailer/mailer.module';
import { MailerService } from '../mailer/mailer.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, BcryptAdapter, JwtStrategy, GoogleStrategy, MailerService],
    imports: [
        ConfigModule,

        MailerModule,

        TypeOrmModule.forFeature([User]),

        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: '3h',
                    },
                };
            },
        }),
    ],
    exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule { }
