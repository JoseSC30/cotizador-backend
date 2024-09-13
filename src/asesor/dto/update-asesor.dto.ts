import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/auth/dto';

export class UpdateAsesorDto extends PartialType(CreateUserDto) { 
}
