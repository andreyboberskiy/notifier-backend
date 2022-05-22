import { Controller, Get, Param } from '@nestjs/common';
import { GetUserId } from 'auth/decorators';

import { UserService } from 'user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param() params) {
    return this.userService.getUser(params.id);
  }

  @Get()
  getCurrentUser(@GetUserId() userId: number) {
    return this.userService.getCurrentUser(userId);
  }
}
