import { IsString } from 'class-validator';

export class CreateBuyPaypalDto {
  @IsString()
  amount: string;
}
