import { PartialType } from '@nestjs/swagger';
import { CreateBuyMembershipDto } from './create-buy-membership.dto';

export class UpdateBuyMembershipDto extends PartialType(CreateBuyMembershipDto) {}
