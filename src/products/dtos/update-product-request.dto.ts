import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsUrl } from 'class-validator';
import { ProductCategoryEnum } from 'src/packages/constant/enums/product-categories-enum';

export class UpdateProductRequestDto {
  @ApiPropertyOptional({
    description: 'Name of the product',
    example: 'T-shirt',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Price of the product',
    example: 29.99,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Description of the product',
    example: 'Comfortable cotton T-shirt',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category of the product',
    example: ProductCategoryEnum.CLOTHES,
    enum: ProductCategoryEnum,
  })
  @IsOptional()
  @IsEnum(ProductCategoryEnum)
  category?: ProductCategoryEnum;

  @ApiPropertyOptional({
    description: 'Image URL of the product',
    example: 'https://example.com/tshirt.jpg',
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
