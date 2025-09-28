import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { UserService } from '../service/user.service';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserRequestDto } from '../dtos/update-user-request.dto';
import { GeneralResponseDto } from '../dtos/general-response.dto';
import { Permissions } from 'src/packages/common/decorators/permission.decorator';
import { PermissionsGuard } from 'src/packages/common/guards/permission.guard';
import { UpdateUserRoleRequestDto } from '../dtos/update-user-role-request.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create public user' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Post()
  async create(@Body() createUserRequestDto: CreateUserRequestDto) {
    return this.userService.create(createUserRequestDto);
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'The email of the user',
    example: 'jemmiedave@gmail.com',
  })
  @ApiResponse({ status: 200, description: 'You will recieve a unique user' })
  @Get()
  async Get(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'The email of the user',
    example: 'jemmiedave@gmail.com',
  })
  @ApiResponse({ status: 200, description: 'You will recieve a unique user' })
  @Delete()
  async delete(@Query('email') email: string) {
    return this.userService.delete(email);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ type: UpdateUserRequestDto })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'The email of the user',
    example: 'jemmiedave@gmail.com',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: GeneralResponseDto,
  })
  @Patch()
  async update(
    @Query('email') email: string,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<GeneralResponseDto> {
    return this.userService.update(email, updateUserRequestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update user role (can be done only by ShopOwner role, grant token in the login auth, all details are in the LoginUserRequestDto descriptions )',
  })
  @ApiBody({ type: UpdateUserRoleRequestDto })
  @Patch('/role')
  @UseGuards(PermissionsGuard)
  @Permissions('can_edit_role')
  async updateUserRole(
    @Body() updateUserRoleRequestDto: UpdateUserRoleRequestDto,
  ) {
    return this.userService.updateUserRole(updateUserRoleRequestDto);
  }
}
