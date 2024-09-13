import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FullChatService } from './full-chat.service';
import { CreateFullChatDto } from './dto/create-full-chat.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FullChat } from './entities/full-chat.entity';

@ApiTags('full-chat')
@Controller('full-chat')
export class FullChatController {
  constructor(private readonly fullChatService: FullChatService) {}

  @Post()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'fullChat was created',
    type: FullChat,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 404,
    description: 'No hay asesores para asignar al fullchat',
  })
  @ApiResponse({
    status: 500,
    description: 'Posiblemente usuario no autenticado o revisar logs',
  })
  create(
    @Body() createFullChatDto: CreateFullChatDto,
    @GetUser() authUser: User,
  ) {
    return this.fullChatService.create(createFullChatDto, authUser);
  }

  @Get()
  @Auth()
  getInfo(@GetUser('id') id: string) {
    return this.fullChatService.getInfo(id);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.fullChatService.findOne(+id);
  }
}
