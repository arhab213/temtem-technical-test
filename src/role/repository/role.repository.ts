import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from 'src/packages/schemas/role.schema';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async findRoleByName(name: string): Promise<RoleDocument | null> {
    return await this.roleModel.findOne({ name }).lean();
  }

  async findRolesByIdWithRelations(_id: Types.ObjectId): Promise<Role | null> {
    return await this.roleModel.findOne({ _id }).populate('permissions').exec();
  }
}
