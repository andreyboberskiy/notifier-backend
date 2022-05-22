import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'user/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username'],
    });

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User with this id not found');
    }
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User with this id not found');
    }
  }
}
