import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty({
    example: 'zidan',
    description: 'Letters and spaces only, no numbers or symbols.',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    example: 'zizo',
    description: 'Letters and spaces only, no numbers or symbols.',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    example: 'myPassword123',
    description:
      'Password must contain letters, numbers, and optionally symbols.',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
