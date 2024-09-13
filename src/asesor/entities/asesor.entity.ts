import { Entity, Column } from 'typeorm';
import { User } from '../../auth/entities/user.entity'; 
export class Asesor  extends User{
    @Column('text', {
        array: true,
        default: ['asesor'], 
      })
      roles: string[];
}
