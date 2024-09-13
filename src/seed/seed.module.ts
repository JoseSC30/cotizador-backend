import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from './../auth/auth.module';
import { CurrencyService } from '../currency/currency.service';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService, CurrencyService],
  imports: [AuthModule, CurrencyModule],
})
export class SeedModule {}
