import { Module } from '@nestjs/common';
import { FullChatService } from './full-chat.service';
import { FullChatController } from './full-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FullChat } from './entities/full-chat.entity';
import { ChatAiService } from '../chat-ai/chat-ai.service';
import { ChatStockService } from '../chat-stock/chat-stock.service';
import { AuthService } from '../auth/auth.service';
import { ChatAiModule } from '../chat-ai/chat-ai.module';
import { ChatStockModule } from '../chat-stock/chat-stock.module';
import { AuthModule } from '../auth/auth.module';
import { MembershipService } from '../membership/membership.service';
import { MembershipModule } from '../membership/membership.module';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  controllers: [FullChatController],
  providers: [
    FullChatService,
    ChatAiService,
    ChatStockService,
    AuthService,
    MembershipService,
    ConfigService,
    CloudinaryService
  ],
  imports: [
    TypeOrmModule.forFeature([FullChat]),
    ChatAiModule,
    ChatStockModule,
    AuthModule,
    MembershipModule,
    CloudinaryModule,
  ],
  exports: [TypeOrmModule],
})
export class FullChatModule {}
