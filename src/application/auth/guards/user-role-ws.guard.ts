import { Reflector } from '@nestjs/core';
import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets/errors/ws-exception';
import { META_ROLES } from 'src/application/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleWsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const validRoles: string[] = this.reflector.get(
            META_ROLES,
            context.getHandler(),
        );
        
        if (!validRoles) return true;
        if (validRoles.length === 0) return true;

        const client = context.switchToWs().getClient();
        const user = client.user;

        if (!user) throw new BadRequestException('User not found');

        for (const role of user.roles) {
            if (validRoles.includes(role)) {
                return true;
            }
        }

        throw new ForbiddenException(
            `User ${user.fullName} need a valid role: [${validRoles}]`,
        );
    }
}
