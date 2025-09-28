import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: 'jemmiedave@gmail.com',
    description: 'Must align email type',
  })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsString()
  @IsEmail({}, { message: 'Must align email type' })
  email: string;

  @ApiProperty({
    example:
      'from the endpoint above you can get a refresh token to try this endpoint, just replace this text by token',
    description: 'should put the refresh token here',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
