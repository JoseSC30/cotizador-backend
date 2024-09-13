import { ApiProperty } from '@nestjs/swagger';

export class CreateDto {
  @ApiProperty({ type: String, required: false })
  data?: string;

  @ApiProperty({ type: [String], required: false })
  images?: string[];
}
