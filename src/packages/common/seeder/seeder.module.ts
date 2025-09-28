import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
} from 'src/packages/schemas/permissions.schema';
import { Role, RoleSchema } from 'src/packages/schemas/role.schema';
import { User, UserSchema } from 'src/packages/schemas/user.schema';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    const permissions = await this.seederService.ensurePermissions(
      '/src/packages/common/seeder/assets/permission.json',
    );
    console.log('🌱 Permissions Seeded');

    console.log('🌱 Roles seeded');
    const roles = await this.seederService.ensureRoles(
      '/src/packages/common/seeder/assets/role.json',
      permissions,
    );

    console.log('🌱 Default users seeded');
    await this.seederService.ensureDefaultUsers(
      '/src/packages/common/seeder/assets/user.json',
      roles,
    );
  }
}
