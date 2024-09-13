import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BuyMembership } from '../../buy-membership/entities/buy-membership.entity';

@Entity('currencies')
export class Currency {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  symbol: string;

  @OneToMany(() => BuyMembership, (buyMembership) => buyMembership.currency)
  buyMemberships: BuyMembership[];
}
