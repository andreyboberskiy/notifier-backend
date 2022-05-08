import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import analytic from 'analytic';
import { SendNotificationDto } from 'notification/dto/send-notification.dto';
import { Notification } from 'notification/entity/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async sendNotification(
    sendNotificationDto: SendNotificationDto,
  ): Promise<boolean> {
    console.log('Send notification to user', sendNotificationDto);

    const notification =
      this.notificationRepository.create(sendNotificationDto);
    await notification.save();

    analytic.send('Notified', sendNotificationDto.user.id);

    return true;
  }
}
