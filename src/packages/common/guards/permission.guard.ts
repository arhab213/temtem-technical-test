import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { JwtPayloadInterface } from '../interfaces/auth.service.interfaces';
import { ConfigService } from '@nestjs/config';
import { Permission } from 'src/packages/schemas/permissions.schema';
import {
  INSUFFICIENT_PERMISSIONS,
  MISSING_AUTHORIZATION_HEADER,
  TOKEN_HAS_EXPIRED,
  TOKEN_IS_INVALID,
} from 'src/packages/constant/message-constant';
interface AuthenticatedRequest extends Request {
  user?: JwtPayloadInterface;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }

    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string;
    if (!authHeader) {
      throw new UnauthorizedException(MISSING_AUTHORIZATION_HEADER);
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(
        token,
        this.configService.get<string>('ACCESS_TOKEN_SECRET') || '',
      ) as JwtPayloadInterface;

      const permissionKeys = this.convertPermissionsIntoArrayOfKeys(
        payload.permissions,
      );

      const hasPermission = requiredPermissions.every((p) =>
        permissionKeys.includes(p),
      );

      if (!hasPermission) {
        throw new ForbiddenException(INSUFFICIENT_PERMISSIONS);
      }

      request.user = payload;

      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(TOKEN_HAS_EXPIRED);
      }

      if (error instanceof ForbiddenException) throw error;

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(TOKEN_IS_INVALID);
      }

      return false;
    }
  }

  private convertPermissionsIntoArrayOfKeys(Permissions: Permission[]) {
    return Permissions.map((permission) => permission.key);
  }
}
