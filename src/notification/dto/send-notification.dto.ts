import {
  NotificationOrderTriggeredData,
  NotificationTemplateNewsData,
  NotificationTypeEnum,
} from 'notification/notification.types';
import { User } from 'user/entity/user.entity';

export class SendNotificationDto {
  title: string;
  subtitle?: string;
  user: User;
  type: NotificationTypeEnum;
  data: NotificationTemplateNewsData | NotificationOrderTriggeredData;
}
