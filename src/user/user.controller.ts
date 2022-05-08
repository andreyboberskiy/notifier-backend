import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from 'user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param() params) {
    return this.userService.getUser(params.id);
  }
}
