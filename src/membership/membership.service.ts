import { Injectable } from '@nestjs/common';
import { Membership } from './entities/membership.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ChatStockService } from '../chat-stock/chat-stock.service';
import { CreateChatStockDto } from '../chat-stock/dto/create-chat-stock.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    private readonly chatStockService: ChatStockService,
  ) {}

  async create(createChatStockDto: CreateChatStockDto, user: User) {
    const newChatStock = await this.chatStockService.create(createChatStockDto);
    const newMembership = this.membershipRepository.create({
      user,
      chatStock: newChatStock,
    });
    return await this.membershipRepository.save(newMembership);
  }
}
