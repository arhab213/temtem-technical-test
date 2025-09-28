import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema()
export class Permission {
  @Prop({ type: String, required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  key: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  category: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
