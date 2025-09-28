import { ApiProperty } from '@nestjs/swagger';

export class GeneralResponseDto {
  @ApiProperty({ type: Boolean })
  status: boolean;

  @ApiProperty({ type: Number, default: 200 })
  code: number;

  @ApiProperty({ type: String })
  message: string;
}
