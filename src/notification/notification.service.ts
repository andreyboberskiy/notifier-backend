import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import analytic from 'analytic';
import { SendNotificationDto } from 'notification/dto/send-notification.dto';
import { Notification } from 'notification/entity/notification.entity';
import { NotificationGateway } from 'notification/notification.gateway';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationGateway: NotificationGateway,
  ) {}

  async sendNotification(
    sendNotificationDto: SendNotificationDto,
  ): Promise<boolean> {
    console.log('Send notification to user', sendNotificationDto);
    const { title, subtitle, user } = sendNotificationDto;

    const notification =
      this.notificationRepository.create(sendNotificationDto);
    await notification.save();

    this.notificationGateway.broadcast('notification', user.id, {
      title,
      subtitle,
    });

    analytic.send('Notified', sendNotificationDto.user.id);

    return true;
  }

  async getUnread(userId: number) {
    return this.notificationRepository.findBy({
      user: { id: userId },
      read: false,
    });
  }

  async read(userId: number, notificationId: number) {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
      user: { id: userId },
      read: false,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    await notification.save();
  }
}
