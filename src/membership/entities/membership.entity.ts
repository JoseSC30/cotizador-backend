import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BuyMembership } from '../../buy-membership/entities/buy-membership.entity';
import { User } from '../../auth/entities/user.entity';
import { ChatStock } from '../../chat-stock/entities/chat-stock.entity';

@Entity('membership')
export class Membership {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => BuyMembership, (buyMembership) => buyMembership.membership)
  buyMemberships: BuyMembership[];

  @OneToOne(() => User, (user) => user.membership) // specify inverse side as a second parameter
  @JoinColumn()
  user: User;

  @OneToOne(() => ChatStock, (chatStock) => chatStock.membership) // specify inverse side as a second parameter
  @JoinColumn()
  chatStock: ChatStock;
}
