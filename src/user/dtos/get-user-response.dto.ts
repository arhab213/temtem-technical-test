import { ApiProperty } from '@nestjs/swagger';
import type { RolePopulated } from 'src/packages/common/interfaces/auth.service.interfaces';
import { Role } from 'src/packages/schemas/role.schema';

export class GetUserResponseDto {
  @ApiProperty({ example: 'Jemmie', description: 'User first name' })
  firstname: string;

  @ApiProperty({ example: 'Dave', description: 'User last name' })
  lastname: string;

  @ApiProperty({ example: 'jemmiedave@gmail.com', description: 'User email' })
  email: string;

  @ApiProperty({
    type: [Role],
    description: 'Array of user roles',
    example: [
      { _id: '64f5a0c8e1b2a0b123456789', name: 'Admin' },
      { _id: '64f5a0c8e1b2a0b123456780', name: 'User' },
    ],
  })
  role: RolePopulated;
}
