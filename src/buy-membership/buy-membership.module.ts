import { Module } from '@nestjs/common';
import { BuyMembershipService } from './buy-membership.service';
import { BuyMembershipController } from './buy-membership.controller';
import { ChatStockService } from '../chat-stock/chat-stock.service';
import { CurrencyService } from '../currency/currency.service';
import { BuyMembership } from './entities/buy-membership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChatStockModule } from '../chat-stock/chat-stock.module';
import { CurrencyModule } from '../currency/currency.module';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [BuyMembershipController],
  providers: [
    BuyMembershipService,
    ChatStockService,
    CurrencyService,
    ConfigService,
  ],
  imports: [
    TypeOrmModule.forFeature([BuyMembership]),
    AuthModule,
    ChatStockModule,
    CurrencyModule,
  ],
  exports: [TypeOrmModule],
})
export class BuyMembershipModule {}
