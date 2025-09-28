import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { User } from 'src/packages/schemas/user.schema';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/user.repository';
import { RoleRepository } from 'src/role/repository/role.repository';
import {
  FAILED_TO_FIND_ROLE,
  ROLE_NOT_FOUND,
  USER_CREATED_SUCCESSFULLY,
  USER_SUCCESSFULLY_RETRIEVED,
  USER_NOT_FOUND,
  FAILED_TO_DELETE_USER,
  USER_DELETED_SUCCESSFULLY,
  USER_UPDATED_SUCCESSFULLY,
  USER_ROLE_UPDATED_SUCCESSFULLY,
} from 'src/packages/constant/message-constant';

import { Types } from 'mongoose';
import { Role, RoleDocument } from 'src/packages/schemas/role.schema';
import {
  buildSuccessResponseWithData,
  SuccessResponseWithData,
} from 'src/packages/utils/build-sucess-response-with-data';
import { GetUserResponseDto } from '../dtos/get-user-response.dto';
import { buildGeneralResponse } from 'src/packages/utils/build-general-response';
import { UpdateUserRequestDto } from '../dtos/update-user-request.dto';
import { GeneralResponseDto } from '../dtos/general-response.dto';
import { RolePopulated } from 'src/packages/common/interfaces/auth.service.interfaces';
import { UpdateUserRoleRequestDto } from '../dtos/update-user-role-request.dto';
import { ConfirmationResponseDto } from '../dtos/confirmation-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async create(CreateUserData: CreateUserRequestDto) {
    const { firstname, lastname, password, email } = CreateUserData;
    const publicUserRoleDefaultName = 'Guest';

    try {
      const role = await this.roleRepository.findRoleByName(
        publicUserRoleDefaultName,
      );
      if (!role)
        throw new NotFoundException(ROLE_NOT_FOUND(publicUserRoleDefaultName));

      const createUserData: Omit<User, 'refreshTokenHash'> = {
        firstname,
        lastname,
        email,
        passwordHash: this.hashPassword(password),
        role: [role],
      };
      const createUser = await this.userRepository.create(createUserData);

      return {
        _id: createUser._id.toString(),
        message: USER_CREATED_SUCCESSFULLY(createUser._id.toString()),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserByEmail(
    email: string,
  ): Promise<SuccessResponseWithData<GetUserResponseDto>> {
    try {
      const retreivedUser = await this.userRepository.getUserByEmail(email);
      if (!retreivedUser) {
        throw new NotFoundException(USER_NOT_FOUND(email));
      }

      const user: GetUserResponseDto = {
        firstname: retreivedUser.firstname,
        lastname: retreivedUser.lastname,
        email: retreivedUser.email,
        role: await this.findRolesWithPopulatedPermissions(retreivedUser.role),
      };

      return buildSuccessResponseWithData<GetUserResponseDto>(
        user,
        200,
        USER_SUCCESSFULLY_RETRIEVED,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(email: string) {
    try {
      const deleteUser = await this.userRepository.delete(email);
      if (!deleteUser)
        throw new InternalServerErrorException(FAILED_TO_DELETE_USER);

      return buildGeneralResponse(USER_DELETED_SUCCESSFULLY, 200);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    email: string,
    data: UpdateUserRequestDto,
  ): Promise<GeneralResponseDto> {
    const { firstname, lastname, password } = data;
    try {
      const updatedata: Partial<User> = {
        firstname,
        lastname,
        passwordHash: this.hashPassword(password),
      };
      const updateCursor = await this.userRepository.update(email, updatedata);
      return buildGeneralResponse(USER_UPDATED_SUCCESSFULLY, 201);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUserRole(
    updateUserRoleRequestDto: UpdateUserRoleRequestDto,
  ): Promise<ConfirmationResponseDto> {
    const { email, role } = updateUserRoleRequestDto;
    try {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) throw new NotFoundException(USER_NOT_FOUND);

      const Role = await this.roleRepository.findRoleByName(role);
      if (!Role) throw new NotFoundException(ROLE_NOT_FOUND);

      user.role = [Role._id];
      await user.save();

      return {
        _id: user._id.toString(),
        message: USER_ROLE_UPDATED_SUCCESSFULLY(user._id.toString()),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
