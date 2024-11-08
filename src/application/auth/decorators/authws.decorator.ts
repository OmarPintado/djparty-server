import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from '../interfaces/valid-roles';
import { UserRoleWsGuard } from '../guards/user-role-ws.guard';

export function AuthWS(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleWsGuard),
    );
}
