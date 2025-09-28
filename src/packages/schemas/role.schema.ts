import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsEnum } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { AccessType } from '../constant/enums/access-type-enum';
import { Permission } from './permissions.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  @IsEnum(AccessType)
  accessType: AccessType;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }], required: true })
  @IsArray()
  permissions: Types.ObjectId[] | Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
