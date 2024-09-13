import { Controller, Get, Post, Body, Patch, Param, Delete,ParseUUIDPipe } from '@nestjs/common';
import { AsesorService } from './asesor.service';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { CreateUserDto } from 'src/auth/dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../auth/entities/user.entity';


@ApiTags('Asesor')
@Controller('asesor')
export class AsesorController {
  constructor(private readonly asesorService: AsesorService) {}

  @Post('create')
  create(@Body() createAsesorDto: CreateUserDto) {
    return this.asesorService.create(createAsesorDto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateAsesorDto) {
    return this.asesorService.update(id, updateUserDto);
  }
  
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe)id: string){
    return this.asesorService.delete(id);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string){
    return this.asesorService.findOne(id);
  }
  
  @Get()
  findAll() {
    return this.asesorService.findAll();
  }
}
