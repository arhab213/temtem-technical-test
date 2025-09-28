import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategoryEnum } from 'src/packages/constant/enums/product-categories-enum';

export class FetchProductFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by a single category',
    enum: ProductCategoryEnum,
  })
  @IsOptional()
  @IsEnum(ProductCategoryEnum, {
    message: 'Category must be one of the allowed values',
  })
  category?: ProductCategoryEnum;

  @ApiPropertyOptional({
    description: 'Filter by name ',
    example: 'T-shirt',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({
    description:
      'Sort products by price (asc = lowest first, desc = highest first)',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortPrice must be either "asc" or "desc"',
  })
  sortPrice?: 'asc' | 'desc';
}
