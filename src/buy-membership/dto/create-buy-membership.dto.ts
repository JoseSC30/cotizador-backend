import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBuyMembershipDto {
  @ApiProperty({
    description: 'de momento para pruebas despues ira interno en el backend',
  })
  @IsNumber()
  price: number;

  @ApiProperty({ nullable: true })
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiProperty({
    description: 'Listado de beneficios de lo que se compra',
    isArray: true,
  })
  @IsArray()
  benefits: string[];

  @ApiProperty({
    description: 'nombre del plan de la membresia',
  })
  @IsString()
  planName: string;

  @ApiProperty({
    description: 'descripcion de la membresia',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Nro de chats que se esta comprando',
  })
  @IsNumber()
  chatsNumber: number;
}
