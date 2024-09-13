import { PartialType } from '@nestjs/swagger';
import { CreateFullChatDto } from './create-full-chat.dto';

export class UpdateFullChatDto extends PartialType(CreateFullChatDto) {}
