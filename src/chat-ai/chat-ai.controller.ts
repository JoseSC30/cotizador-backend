import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';


@ApiTags('chat-ai')
@Controller('chat-ai')
export class ChatAiController {
;
  constructor(private readonly chatAiService: ChatAiService) {}

  @Post('create-presupuesto')
  @Auth()
  async createPresupuesto(@Body() createChatAiDto: CreateChatAiDto) {
    return this.chatAiService.createPresupuesto(createChatAiDto);
  }

  @Post('create-image')
  @Auth()
  createImage(@Body() createChatAiDto: CreateChatAiDto) {
    return this.chatAiService.createImage(createChatAiDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.chatAiService.findOne(+id);
  }

  
}
