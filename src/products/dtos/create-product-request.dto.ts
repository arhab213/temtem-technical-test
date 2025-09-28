import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsUrl } from 'class-validator';
import { ProductCategoryEnum } from 'src/packages/constant/enums/product-categories-enum';

export class CreateProductRequestDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'T-shirt',
  })
  @IsNotEmpty({ message: 'Product name must not be empty' })
  @IsString({ message: 'Product name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Price of the product in USD',
    example: 29.99,
  })
  @IsNotEmpty({ message: 'Price must not be empty' })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Comfortable cotton T-shirt',
  })
  @IsNotEmpty({ message: 'Description must not be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    description: 'Category of the product',
    enum: ProductCategoryEnum,
    example: ProductCategoryEnum.CLOTHES,
  })
  @IsNotEmpty({ message: 'Category must not be empty' })
  @IsEnum(ProductCategoryEnum, {
    message: 'Category must be a valid ProductCategoryEnum value',
  })
  category: ProductCategoryEnum;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/tshirt.jpg',
  })
  @IsNotEmpty({ message: 'Image URL must not be empty' })
  @IsString({ message: 'Image must be a string' })
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;
}
