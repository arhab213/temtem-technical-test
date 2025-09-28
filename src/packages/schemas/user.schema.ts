import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { Role, RoleDocument } from './role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @Prop({ required: true, unique: true })
  @IsString()
  @IsEmail()
  email: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], required: true })
  role: Types.ObjectId[] | Role[] | RoleDocument[];

  @Prop({ type: String })
  passwordHash: string;

  @Prop({ type: String })
  refreshTokenHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
