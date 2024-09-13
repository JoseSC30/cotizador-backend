import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async findOne(term: number) {
    const currency = await this.currencyRepository
      .createQueryBuilder('currency')
      .where('currency.id = :id', { id: term })
      .getOneOrFail();
    return currency;
  }

  async create(createCurrencyDto: CreateCurrencyDto) {
    const currency = this.currencyRepository.create(createCurrencyDto);
    return await this.currencyRepository.save(currency); // Guardar la entidad en la base de datos
  }
}
