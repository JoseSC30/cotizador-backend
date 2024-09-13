import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatStockDto } from './dto/create-chat-stock.dto';
import { UpdateChatStockDto } from './dto/update-chat-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatStock } from './entities/chat-stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatStockService {
  constructor(
    @InjectRepository(ChatStock)
    private readonly chatStockRepository: Repository<ChatStock>,
  ) {}

  async create(createChatStockDto: CreateChatStockDto) {
    const newChatStock = this.chatStockRepository.create(createChatStockDto);
    return await this.chatStockRepository.save(newChatStock);
  }

  async findOne(term: number) {
    const chatStock = await this.chatStockRepository
      .createQueryBuilder('chatStock')
      .where('chatStock.id = :id', { id: term })
      .getOneOrFail();
    return chatStock;
  }

  async update(
    id: number,
    updateChatStockDto: UpdateChatStockDto,
    isCompra: boolean = false,
  ) {
    try {
      const chatStock = await this.findOne(id);
      if (!chatStock) {
        throw new HttpException('Chat stock not found', HttpStatus.NOT_FOUND);
      }

      if (chatStock.chatsNumber === chatStock.occupied && !isCompra) {
        throw new HttpException(
          'Stock of chats finished, acquire more tokens to create new chats',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.chatStockRepository.update(
        { id },
        {
          chatsNumber: chatStock.chatsNumber + updateChatStockDto.chatsNumber,
          occupied: chatStock.occupied + updateChatStockDto.occupied,
        },
      );
      return {
        message: 'Successful Upgrade!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error during the update process', error);
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
