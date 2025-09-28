import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'Jemmie',
    description: 'Letters and spaces only; no numbers or symbols.',
  })
  @IsNotEmpty({ message: 'Firstname field must not be empty' })
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message:
      'Firstname field must only contains letter and spaces (no numbers no symbols)',
  })
  firstname: string;

  @ApiProperty({
    example: 'dave',
    description: 'Letters and spaces only; no numbers or symbols.',
  })
  @IsNotEmpty({ message: 'Lastname field must not be empty' })
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Lastname field must only contains letter and spaces',
  })
  lastname: string;

  @ApiProperty({ example: 'jemmiedave@gmail.com' })
  @IsNotEmpty({ message: 'Email field must not be empty' })
  @IsString()
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @ApiProperty({ example: 'password!23', description: 'Try to do it hard' })
  @IsNotEmpty({ message: 'Password Field must not be empty' })
  @IsString()
  password: string;
}
