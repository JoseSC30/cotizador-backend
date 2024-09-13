import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Profile } from '../profile/entities/profile.entity';
import { MembershipService } from '../membership/membership.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly membershipService: MembershipService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const profile = new Profile();
      await this.dataSource.manager.save(profile);

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), //10vueltas
        profile,
      });

      await this.userRepository.save(user);
      delete user.password;

      this.assignMembership(user);

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .select([
        'user.id',
        'user.email',
        'user.password', // Incluso si select: false, puedes seleccionarla explícitamente
        'profile',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!user)
      throw new UnauthorizedException('Credentials are not valid(email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid(password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async getAllFromUserAuth(id: string) {
    const user = await this.userRepository.findOne({
      relations: {
        profile: true,
      },
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getUserWithMembershipAndChatStock(id: string) {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.membership', 'membership')
      .leftJoinAndSelect('membership.chatStock', 'chatStock')
      .where('user.id = :id', { id })
      .getOneOrFail();
    return user;
  }

  async getRandomAdvisor(): Promise<User> {
    const advisor = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where(':role = ANY(user.roles)', { role: 'asesor' })
      .orderBy('RANDOM()') // Función para ordenar aleatoriamente (específico de PostgreSQL)
      .getOne();

    if (!advisor) {
      throw new NotFoundException('No advisors available.');
    }

    return advisor;
  }

  // METODOS PRIVADOS ----------------------------

  private assignMembership(user: User) {
    this.membershipService.create({ chatsNumber: 0, occupied: 0 }, user);
    this.logger.log('Successful membership assignment!');
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
