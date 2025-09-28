import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogOutRequestDto {
  @ApiProperty({
    example: 'jemmiedave@gmail.com',
    description: 'Must align email type',
  })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsString()
  @IsEmail({}, { message: 'Must align email type' })
  email: string;
}
