import { Notification } from 'notification/entity/notification.entity';
import { Order } from 'order/entity/order.entity';
import { Template } from 'template/entity/template.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  rtHash: string;

  @OneToMany(() => Template, (template) => template.author)
  templates: Template[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
