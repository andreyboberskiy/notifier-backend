import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUserId } from 'auth/decorators';
import { Notification } from 'notification/entity/notification.entity';
import { NotificationService } from 'notification/notification.service';

@ApiTags('notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getUnread(@GetUserId() userId: number): Promise<Notification[]> {
    return this.notificationService.getUnread(userId);
  }

  @Put('/read/:id')
  @HttpCode(HttpStatus.OK)
  read(
    @GetUserId() userId: number,
    @Param() params: { id: number },
  ): Promise<void> {
    return this.notificationService.read(userId, params.id);
  }
}
