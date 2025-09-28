import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserRequestDto {
  @ApiProperty({
    description:
      "User email ( this one is for granting a  ShopOwner  permissions try 'jemmiedave@gmail.com' for guest permissions )",
    example: 'jhondoe@gmail.com',
  })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsString()
  @IsEmail({}, { message: 'Must align email type' })
  email: string;

  @ApiProperty({
    description:
      "User password (for 'jemmiedave@gmail.com' this is the password : password!23)",
    example: 'ChangePassword123',
  })
  @IsNotEmpty({ message: 'Password field must not be empty' })
  @IsString()
  password: string;
}
