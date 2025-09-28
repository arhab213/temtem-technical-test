import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import path from 'path';
import {
  FAILED_TO_LOAD_ASSETS,
  FAILED_TO_SEED_PERMISSIONS,
  FAILED_TO_SEED_ROLES,
  FAILED_TO_SEED_USERS,
} from 'src/packages/constant/message-constant';
import {
  Permission,
  PermissionDocument,
} from 'src/packages/schemas/permissions.schema';
import { Role, RoleDocument } from 'src/packages/schemas/role.schema';
import { User, UserDocument } from 'src/packages/schemas/user.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async ensurePermissions(assetDirectory: string) {
    try {
      const permissionAssets = this.loadAssets<Permission[]>(assetDirectory);
      const seededPermissions = await this.permissionModel.find().lean();

      for (const permission of permissionAssets) {
        if (
          !seededPermissions.some(
            (permission) => permission.key === permission.key,
          )
        ) {
          await this.permissionModel.create(permission);
        }
      }

      return await this.permissionModel.find().lean();
    } catch (error) {
      throw new InternalServerErrorException(error, FAILED_TO_SEED_PERMISSIONS);
    }
  }

  async ensureRoles(assetDirectory: string, Permissions: PermissionDocument[]) {
    try {
      const roleAssets =
        this.loadAssets<(Role & { permissions: string[] })[]>(assetDirectory);

      const seededRoles = await this.roleModel.find().lean();

      for (const role of roleAssets) {
        const rolePermissions = Permissions.filter((permission) =>
          role.permissions.includes(permission.key),
        );

        const rolePermissionIds = rolePermissions.map(
          (permission) => permission._id,
        );

        if (!seededRoles.some((Role) => Role.name === role.name)) {
          await this.roleModel.create({
            ...role,
            permissions: rolePermissionIds,
          });
        }
      }

      return await this.roleModel.find().lean();
    } catch (error) {
      throw new InternalServerErrorException(error, FAILED_TO_SEED_ROLES);
    }
  }

  async ensureDefaultUsers(assetDirectory: string, Roles: RoleDocument[]) {
    try {
      const defaultUserAssests =
        this.loadAssets<(User & { role: string[] })[]>(assetDirectory);

      const seededDefaultUser = await this.userModel.find().lean();

      for (const user of defaultUserAssests) {
        const userRoles = Roles.filter((userRole) =>
          user.role.includes(userRole.name),
        );

        const userRoleIds = userRoles.map((role) => role._id);

        if (!seededDefaultUser.some((user) => user.email === user.email)) {
          await this.userModel.create({ ...user, role: userRoleIds });
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error, FAILED_TO_SEED_USERS);
    }
  }

  private loadAssets<T>(assetDirectory: string) {
    const assetsPath = path.join(process.cwd(), assetDirectory);
    try {
      return JSON.parse(fs.readFileSync(assetsPath, 'utf-8')) as T;
    } catch (error) {
      throw new InternalServerErrorException(FAILED_TO_LOAD_ASSETS, error);
    }
  }
}
