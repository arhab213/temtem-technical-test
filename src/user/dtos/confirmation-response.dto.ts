import { ApiProperty } from '@nestjs/swagger';

export class ConfirmationResponseDto {
  @ApiProperty({ description: 'Document id in string type' })
  _id: string;

  @ApiProperty({ description: 'Confirmation message provided ' })
  message: string;
}
