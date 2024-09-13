import { Module } from '@nestjs/common';
import { AsesorService } from './asesor.service';
import { AsesorController } from './asesor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';

@Module({
  controllers: [AsesorController],
  providers: [AsesorService],
  imports:[
    TypeOrmModule.forFeature([User]),
  ]
})
export class AsesorModule {}
