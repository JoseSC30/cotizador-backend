import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ChatAi } from '../../chat-ai/entities/chat-ai.entity';

@Entity('full_chat')
export class FullChat {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('text')
  name: string;

  @ManyToOne(() => User, (user) => user.fullChats)
  userClient: User;

  @ManyToOne(() => User, (user) => user.supFullChats)
  userAsesor: User;

  @OneToOne(() => ChatAi, (chatAi) => chatAi.fullChat) // specify inverse side as a second parameter
  @JoinColumn()
  chatAi: ChatAi;
}
