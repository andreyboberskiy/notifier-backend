import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from 'auth/decorators';

import { UserService } from 'user/user.service';

@ApiTags('user')
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
