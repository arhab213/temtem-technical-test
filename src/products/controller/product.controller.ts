import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from '../service/product.service';
import { CreateProductRequestDto } from '../dtos/create-product-request.dto';
import { UpdateProductRequestDto } from '../dtos/update-product-request.dto';
import { FetchProductFilterDto } from '../dtos/fetch-product-request.dto';
import { Product } from 'src/packages/schemas/product.schema';
import { SuccessResponseWithData } from 'src/packages/utils/build-sucess-response-with-data';
import { PermissionsGuard } from 'src/packages/common/guards/permission.guard';
import { Permissions } from 'src/packages/common/decorators/permission.decorator';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('can_add_products')
  async create(@Body() createProductRequestDto: CreateProductRequestDto) {
    return await this.productService.create(createProductRequestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '64f2a1b3c2e4f0a123456789',
  })
  @ApiBody({ type: UpdateProductRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('can_update_products')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductRequestDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '64f2a1b3c2e4f0a123456789',
  })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('can_delete_products')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  //retrieve products
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [Product],
  })
  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('can_view_products')
  async getAll(): Promise<SuccessResponseWithData<Product[]>> {
    return this.productService.getAllProducts();
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve products by filter' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by product name',
    example: 'T-shirt',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
    example: 'CLOTHES',
  })
  @ApiQuery({
    name: 'sortPrice',
    required: false,
    description: 'Sort by price',
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered products',
    type: [Product],
  })
  @Get('filter')
  @UseGuards(PermissionsGuard)
  @Permissions('can_view_products')
  async findByFilter(
    @Query() filter: FetchProductFilterDto,
  ): Promise<Product[]> {
    return this.productService.findByFilter(filter);
  }
}
