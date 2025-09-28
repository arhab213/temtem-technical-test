import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/packages/schemas/product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(data: Product) {
    return await this.productModel.create(data);
  }

  async findOneById(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async findByFilter(filter: Partial<Product> = {}) {
    return await this.productModel.find(filter);
  }

  async find() {
    return await this.productModel.find().exec();
  }

  async update(id: string, data: Partial<Product>) {
    return await this.productModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.productModel.findByIdAndDelete(id).exec();
  }
}
