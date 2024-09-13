import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { ChatStockService } from '../chat-stock/chat-stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { ChatStockModule } from '../chat-stock/chat-stock.module';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService, ChatStockService],
  imports: [TypeOrmModule.forFeature([Membership]), ChatStockModule],
  exports: [TypeOrmModule],
})
export class MembershipModule {}
