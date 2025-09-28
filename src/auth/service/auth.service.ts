import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  FAILED_TO_FIND_ROLE,
  FAILED_TO_GENERATE_REFRESH_TOKEN,
  FAILED_TO_LOGIN,
  LOGGED_OUT_SUCCESSFULLY,
  ROLE_NOT_FOUND,
  UNAUTHORIZED_ACCESS,
  FAILED_TO_VIRIFY_TOKEN,
  USER_NOT_FOUND,
  TOKEN_HAS_EXPIRED,
  TOKEN_IS_INVALID,
  PASSWORD_IS_NOT_CORRECT,
} from 'src/packages/constant/message-constant';
import { UserRepository } from 'src/user/repository/user.repository';
import { Role, RoleDocument } from 'src/packages/schemas/role.schema';
import { Permission } from 'src/packages/schemas/permissions.schema';
import { RoleRepository } from 'src/role/repository/role.repository';
import { Types } from 'mongoose';
import { LoginUserRequestDto } from '../dtos/login-user-request.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token-request.dto';
import { UserDocument } from 'src/packages/schemas/user.schema';
import { LogOutRequestDto } from '../dtos/logout-request.dto';
import { buildGeneralResponse } from 'src/packages/utils/build-general-response';
import {
  RolePopulated,
  JwtPayloadInterface,
} from 'src/packages/common/interfaces/auth.service.interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositroy: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUserRequestDto: LoginUserRequestDto) {
    const { email, password } = loginUserRequestDto;
    try {
      const user = await this.userRepositroy.getUserByEmail(email);
      if (!user) throw new NotFoundException(USER_NOT_FOUND(email));

      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new BadRequestException(PASSWORD_IS_NOT_CORRECT);

      const roleWithPopulatedPermissions =
        await this.findRolesWithPopulatedPermissions(user.role);

      const payload = this.buildTokenPayload(
        roleWithPopulatedPermissions.permissions,
        email,
      );

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      user.refreshTokenHash = this.hashSecret(refreshToken);
      await user.save();

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(FAILED_TO_LOGIN, error);
    }
  }

  async refreshToken(refreshTokenRequesDto: RefreshTokenRequestDto) {
    const { refreshToken, email } = refreshTokenRequesDto;
    try {
      const user = await this.userRepositroy.getUserByEmail(email);
      if (!user) throw new NotFoundException(USER_NOT_FOUND);

      if (
        !bcrypt.compareSync(refreshToken, user.refreshTokenHash) ||
        !user.refreshTokenHash
      )
        throw new UnauthorizedException(UNAUTHORIZED_ACCESS);

      const payload = this.verifyTokenExpiryAndRegeneratePayload(
        refreshToken,
        'refreshSecret',
      );

      return this.regenrateTokens(payload, user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(FAILED_TO_GENERATE_REFRESH_TOKEN);
    }
  }

  async logout(logOutRequestDto: LogOutRequestDto) {
    const { email } = logOutRequestDto;
    try {
      await this.userRepositroy.update(email, { refreshTokenHash: '' });

      return buildGeneralResponse(LOGGED_OUT_SUCCESSFULLY, 200);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private buildTokenPayload(permissions: Permission[], email: string) {
    return {
      permissions,
      email,
    };
  }

  private async regenrateTokens(
    payload: JwtPayloadInterface,
    user: UserDocument,
  ) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    user.refreshTokenHash = this.hashSecret(refreshToken);
    await user.save();

    return { accessToken, refreshToken };
  }

  private generateAccessToken(payload: JwtPayloadInterface) {
    return jwt.sign(
      payload,
      this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
        (() => {
          throw new Error('ACCESS_TOKEN_SECRET is not defined');
        })(),
      {
        expiresIn: '15m',
      },
    );
  }

  private generateRefreshToken(payload: JwtPayloadInterface): string {
    return jwt.sign(
      payload,
      this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
        (() => {
          throw new Error('REFRESH_TOKEN_SECRET is not defined');
        })(),
      {
        expiresIn: '7d',
      },
    );
  }

  private async findRolesWithPopulatedPermissions(
    userRole: Types.ObjectId[] | Role[] | RoleDocument[],
  ): Promise<RolePopulated> {
    try {
      const role = this.fromDocumentToObjectIds<Role, RoleDocument>(userRole);
      if (!role)
        throw new NotFoundException(ROLE_NOT_FOUND(FAILED_TO_FIND_ROLE));

      const Role = await this.roleRepository.findRolesByIdWithRelations(role);

      return Role as RolePopulated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(FAILED_TO_FIND_ROLE, error);
    }
  }

  private fromDocumentToObjectIds<T, K>(
    Documents: Types.ObjectId[] | T[] | K[],
  ) {
    return Documents.map((Document) =>
      Document instanceof Types.ObjectId ? Document : (Document._id as T),
    )[0] as Types.ObjectId;
  }

  private verifyTokenExpiryAndRegeneratePayload(token: string, secret: string) {
    try {
      return jwt.verify(token, secret) as JwtPayloadInterface;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(TOKEN_HAS_EXPIRED);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(TOKEN_IS_INVALID);
      }
      throw new InternalServerErrorException(FAILED_TO_VIRIFY_TOKEN, error);
    }
  }

  private hashSecret(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
