import { User } from 'user/entity/user.entity';

export class SendNotificationDto {
  title: string;
  subtitle?: string;
  user: User;
}
