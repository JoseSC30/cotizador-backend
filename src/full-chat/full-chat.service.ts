import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateFullChatDto } from './dto/create-full-chat.dto';
import { FullChat } from './entities/full-chat.entity';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ChatAiService } from '../chat-ai/chat-ai.service';
import { ChatStockService } from '../chat-stock/chat-stock.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FullChatService {
  private readonly logger = new Logger('FullChatService');
  constructor(
    private readonly dataSource: DataSource,
    private readonly chatAiService: ChatAiService,
    private readonly chatStockService: ChatStockService,
    private readonly authService: AuthService,
  ) {}

  async create(createFullChatDto: CreateFullChatDto, authUser: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userAdvisor = await this.authService.getRandomAdvisor();
      const chatAi = await this.chatAiService.create({});

      const fullChat = new FullChat();
      fullChat.name = createFullChatDto.name;
      fullChat.userClient = authUser;
      fullChat.userAsesor = userAdvisor;
      fullChat.chatAi = chatAi;

      const userWithInfo =
        await this.authService.getUserWithMembershipAndChatStock(authUser.id);

      await this.chatStockService.update(userWithInfo.membership.chatStock.id, {
        chatsNumber: 0,
        occupied: 1,
      });

      await queryRunner.manager.save(fullChat);

      // Commit transaction
      await queryRunner.commitTransaction();
      return fullChat;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getInfo(userId: string) {
    const user = await this.dataSource.getRepository(User).findOneOrFail({
      relations: {
        membership: {
          chatStock: true,
        },
        fullChats: {
          chatAi: true,
        },
      },
      where: { id: userId },
    });
    return user;
  }

  async findOne(term: number) {
    const fullChat = await this.dataSource
      .getRepository(FullChat)
      .findOneOrFail({
        relations: {
          chatAi: true,
          userAsesor: true,
          userClient: true,
        },
        where: { id: term },
      });
    return fullChat;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(`${error}`);
  }
}
