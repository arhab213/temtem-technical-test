import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../respository/product.repository';
import { CreateProductRequestDto } from '../dtos/create-product-request.dto';
import {
  FAILED_TO_CREATE_PRODUCT,
  FAILED_TO_DELETE_PRODUCT,
  FAILED_TO_RETRIEVE_ALL_PRODUCTS,
  FAILED_TO_RETRIEVE_PRODUCTS_WITH_FILTER,
  FAILED_TO_UPDATE_PRODUCT,
  PRODUCT_DELETED_SUCCESSFULLY,
  PRODUCT_NOT_FOUND,
  SUCCESSFULLY_RETREIVED_ALL_PRODUCTS,
} from 'src/packages/constant/message-constant';
import {
  buildSuccessResponseWithData,
  SuccessResponseWithData,
} from 'src/packages/utils/build-sucess-response-with-data';
import { Product } from 'src/packages/schemas/product.schema';
import { FetchProductFilterDto } from '../dtos/fetch-product-request.dto';
import { FilterQuery } from 'mongoose';
import { UpdateProductRequestDto } from '../dtos/update-product-request.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductRequestDto: CreateProductRequestDto) {
    try {
      const product = await this.productRepository.create(
        createProductRequestDto,
      );

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error, FAILED_TO_CREATE_PRODUCT);
    }
  }

  async delete(id: string) {
    try {
      const product = await this.productRepository.findOneById(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      const result = await this.productRepository.delete(id);
      if (!result) {
        throw new NotFoundException(FAILED_TO_DELETE_PRODUCT);
      }

      return {
        _id: id,
        message: PRODUCT_DELETED_SUCCESSFULLY(id),
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async getAllProducts(): Promise<SuccessResponseWithData<Product[]>> {
    try {
      const products = await this.productRepository.find();
      return buildSuccessResponseWithData<Product[]>(
        products,
        200,
        SUCCESSFULLY_RETREIVED_ALL_PRODUCTS,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ALL_PRODUCTS);
    }
  }

  async findByFilter(filter: FetchProductFilterDto): Promise<Product[]> {
    const query: FilterQuery<Product> = {};

    if (filter.name) query.name = { $regex: filter.name, $options: 'i' };
    if (filter.category) query.category = filter.category;

    let products: Product[];

    try {
      products = await this.productRepository.findByFilter(query);
    } catch (error) {
      throw new InternalServerErrorException(
        FAILED_TO_RETRIEVE_PRODUCTS_WITH_FILTER,
        error,
      );
    }

    if (filter.sortPrice) {
      products = products.sort((a, b) =>
        filter.sortPrice === 'asc'
          ? (a.price ?? 0) - (b.price ?? 0)
          : (b.price ?? 0) - (a.price ?? 0),
      );
    }

    return products;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductRequestDto,
  ): Promise<Product> {
    try {
      const updated = await this.productRepository.update(id, updateProductDto);
      if (!updated) throw new NotFoundException(PRODUCT_NOT_FOUND);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(FAILED_TO_UPDATE_PRODUCT, error);
    }
  }
}
