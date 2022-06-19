import {
  NotificationOrderTriggeredData,
  NotificationTemplateNewsData,
  NotificationTypeEnum,
} from 'notification/notification.types';
import { Order } from 'order/entity/order.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'user/entity/user.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subtitle: string | null;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'enum', enum: NotificationTypeEnum })
  type: NotificationTypeEnum;

  @Column({
    type: 'jsonb',
  })
  data: NotificationOrderTriggeredData | NotificationTemplateNewsData;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
