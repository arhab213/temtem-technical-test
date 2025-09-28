import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductCategoryEnum } from '../constant/enums/product-categories-enum';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    required: true,
    enum: Object.values(ProductCategoryEnum),
  })
  category: ProductCategoryEnum;

  @Prop({ type: String, required: true })
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
