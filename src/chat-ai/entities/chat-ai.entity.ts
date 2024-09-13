import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FullChat } from '../../full-chat/entities/full-chat.entity';

@Entity('chat_ai')
export class ChatAi {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: false }) // Indicate optional in Swagger UI
  @Column('text', { nullable: true })
  data?: string;

  @ApiProperty({ type: [String], required: false }) // Indicate optional in Swagger UI
  @Column('text', { nullable: true, array: true })
  images?: string[];

  @OneToOne(() => FullChat, (fullChat) => fullChat.chatAi) // specify inverse side as a second parameter
  fullChat: FullChat;
}
