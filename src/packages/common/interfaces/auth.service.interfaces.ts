import { Permission } from 'src/packages/schemas/permissions.schema';
import { Role } from 'src/packages/schemas/role.schema';

export interface RolePopulated extends Omit<Role, 'permissions'>, Document {
  permissions: Permission[];
}

export interface JwtPayloadInterface {
  permissions: Permission[];
  email: string;
}
