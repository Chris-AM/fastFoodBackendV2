import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { META_ROLES } from '../../../common/constants';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    if (!validRoles || validRoles.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) {
      throw new InternalServerErrorException(
        'Usuario no encontrado (por Request)',
      );
    }
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    };
    throw new ForbiddenException('Usuario no válido');
  }
}
