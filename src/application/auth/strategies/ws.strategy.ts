import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/domain/entities';
import { WsPayloadInterface } from '../interfaces/ws-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { verify } from 'crypto';

@Injectable()
export class WsStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {
        super();
    }

  async validate(payload: WsPayloadInterface): Promise<User> {
    const { user_id: id } = payload;

    const user = await this.userRepository.findOneBy({ id });
    
    if (!user) throw new UnauthorizedException('Token is not valid.');

    if (!user.isActive)
        throw new UnauthorizedException(
            'User is inactive, contact an admin.',
        );

    return user;
  }
}
