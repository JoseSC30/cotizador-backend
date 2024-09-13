import { IsNumber } from 'class-validator';

export class CreateChatStockDto {
  @IsNumber()
  chatsNumber: number;

  @IsNumber()
  occupied: number;
}
