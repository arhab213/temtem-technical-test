import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/packages/schemas/role.schema';
import { RoleRepository } from './repository/role.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RoleRepository],
  exports: [RoleRepository],
})
export class RoleModule {}
