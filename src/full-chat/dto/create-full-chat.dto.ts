import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFullChatDto {
  @ApiProperty({ description: 'Nombre del chat' })
  @IsString()
  name: string;
}
