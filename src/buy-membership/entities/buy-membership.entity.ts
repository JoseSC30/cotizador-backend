import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Membership } from '../../membership/entities/membership.entity';
import { Currency } from '../../currency/entities/currency.entity';

@Entity('buy_membership')
export class BuyMembership {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('text')
  planName: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column({ type: 'decimal' })
  price: number;

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true })
  chatsNumber: number;

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true })
  attempts: number;

  @ApiProperty()
  @Column('text', { array: true })
  benefits: string[];

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Membership, (membership) => membership.buyMemberships)
  membership: Membership;

  @ManyToOne(() => Currency, (currency) => currency.buyMemberships)
  currency: Currency;
}
