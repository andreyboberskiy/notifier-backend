import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'user/entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository) {}

  async getUser(userId: number) {
    const user = await this.userRepository.findOneById(userId);

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User with this id not found');
    }
  }
}
