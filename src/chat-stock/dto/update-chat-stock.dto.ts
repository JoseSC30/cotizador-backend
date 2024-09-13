import { PartialType } from '@nestjs/swagger';
import { CreateChatStockDto } from './create-chat-stock.dto';

export class UpdateChatStockDto extends PartialType(CreateChatStockDto) {}
