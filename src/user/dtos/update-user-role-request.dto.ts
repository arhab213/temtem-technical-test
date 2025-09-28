import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { DefaultRolesName } from 'src/packages/constant/enums/default-roles-name-enum';

export class UpdateUserRoleRequestDto {
  @ApiProperty({
    example: 'jemmiedave@gmail.com',
    description:
      'should provide the user email that we wanted to update its role',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Seller',
    description: 'should provide the role name (there is default roles seeded)',
  })
  @IsNotEmpty()
  @IsEnum(DefaultRolesName)
  role: string;
}
