import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptAdapter } from '../../infrastructure/adapters/bcrypt.adapter';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly bcryptAdapter: BcryptAdapter,
        private readonly mailService: MailerService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;

            const hashedPassword =
                await this.bcryptAdapter.hashPassword(password);

            const user = this.userRepository.create({
                ...userData,
                password: hashedPassword,
            });

            await this.userRepository.save(user);
            await this.sendMail(user.email, `Sucessfully registration in DjParty!`, `Thanks ${user.fullName} for join to this community, enjoy our services!`)

            return {
                ...user,
            };
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async oauthCreate(oauthCreateUserDto: Omit<CreateUserDto, 'password'>) {
        try {
            const user = this.userRepository.create(oauthCreateUserDto)
            await this.userRepository.save(user);
            await this.sendMail(user.email, `Sucessfully registration in DjParty!`, `Thanks ${user.fullName} for join to this community, enjoy our services!`)

            return {
                ...user,
            };
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { password, email } = loginUserDto;

        const user = await this.userRepository.findOne({
            where: { email },
            select: { email: true, password: true, id: true },
        });

        if (!user) throw new UnauthorizedException('Credentials are not valid');

        if (
            !(await this.bcryptAdapter.comparePasswords(
                password,
                user.password,
            ))
        )
            throw new UnauthorizedException('Credentials are not valid');

        return {
            ...user,
            token: this.getJwtToken({ user_id: user.id }),
        };
    }

    private getJwtToken(payload: JwtPayloadInterface) {
        return this.jwtService.sign(payload);
    }

    private handleDBErrors(error: any): never {
        if (error.code === '23505') throw new BadRequestException(error.detail);
        console.log(error);
        throw new InternalServerErrorException('Please check server logs');
    }

    private async sendMail(to: string, subject: string, text: string) {
        await this.mailService.sendEmail(to, subject, text)
    }
}
