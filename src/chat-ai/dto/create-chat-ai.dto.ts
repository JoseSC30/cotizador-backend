import { IsNumber, IsString } from 'class-validator';

export class CreateChatAiDto {
  @IsString()
  prompt: string;

  @IsNumber()
  iDChatAi: number;
}
