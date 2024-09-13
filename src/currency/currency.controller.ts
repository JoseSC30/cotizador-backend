import { Controller, Get, Param } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(+id);
  }
}
