import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/packages/schemas/role.schema';
import { User, UserSchema } from 'src/packages/schemas/user.schema';

import { RoleRepository } from 'src/role/repository/role.repository';
import { RoleModule } from 'src/role/role.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    UserModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RoleRepository],
  exports: [AuthService],
})
export class AuthModule {}
