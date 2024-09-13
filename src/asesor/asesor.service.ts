import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { CreateUserDto } from 'src/auth/dto';

import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { Profile } from '../profile/entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AsesorService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ){}
  
  async create(createAsesorDto: CreateUserDto) {
    try {
      const {  password, ...userData  } = createAsesorDto;

      const profile = new Profile();
      await this.dataSource.manager.save(profile);

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), 
        profile,
        roles:['asesor']
      });

      await this.userRepository.save(user);
      delete user.password;

      return {message: 'Asesor created successfully'};

    } catch (error) {
      console.log(error);
    }
  } 

  async update(id: string, updateAsesorDto: UpdateAsesorDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateAsesorDto,
    });

    if (!user) throw new NotFoundException(`Asesor with id: ${id} not found`);
    
    await this.userRepository.save(user);

    return {message: 'Asesor created successfully'};

  }

  async findAll(){
     const users = await this.userRepository.find();

     const advisors = users.filter(user => user.roles.includes('asesor'));

     return advisors;
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({where:{id}});

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.remove(user);

    return {message: 'Asesor deleted successfully'};

  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id }
    });
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
