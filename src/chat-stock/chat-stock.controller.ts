import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatStockService } from './chat-stock.service';
import { CreateChatStockDto } from './dto/create-chat-stock.dto';
import { UpdateChatStockDto } from './dto/update-chat-stock.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ChatStock')
@Controller('chat-stock')
export class ChatStockController {
  constructor(private readonly chatStockService: ChatStockService) {}

  // @Post()
  // create(@Body() createChatStockDto: CreateChatStockDto) {
  //   return this.chatStockService.create(createChatStockDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatStockService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChatStockDto: UpdateChatStockDto,
  // ) {
  //   return this.chatStockService.update(+id, updateChatStockDto);
  // }
}
