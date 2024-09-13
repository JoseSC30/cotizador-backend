import { Module } from '@nestjs/common';
import { ChatStockService } from './chat-stock.service';
import { ChatStockController } from './chat-stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatStock } from './entities/chat-stock.entity';

@Module({
  controllers: [ChatStockController],
  providers: [ChatStockService],
  imports: [TypeOrmModule.forFeature([ChatStock])],
  exports: [TypeOrmModule],
})
export class ChatStockModule {}
