import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Membership } from '../../membership/entities/membership.entity';

@Entity('chat_stock')
export class ChatStock {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'integer' })
  chatsNumber: number;

  @ApiProperty()
  @Column({ type: 'integer' })
  occupied: number;

  @OneToOne(() => Membership, (membership) => membership.chatStock)
  membership: Membership;
}
