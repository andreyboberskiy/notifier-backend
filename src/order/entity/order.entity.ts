import { OrderHistory } from 'order-history/entity/order-history.entity';
import { CheckIntervalUnitsEnum } from 'order/types/checkIntervalUnitsEnum';
import { Template } from 'template/entity/template.entity';
import { Notification } from 'notification/entity/notification.entity';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'user/entity/user.entity';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 70 })
  name: string;

  @Column({ type: 'varchar' })
  parseUrl: string;

  @Column()
  compareValue: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 200 })
  notifyPhrase: string;

  @Column({ type: 'int' })
  checkInterval: number;

  @Column({ type: 'enum', enum: CheckIntervalUnitsEnum })
  checkIntervalUnit: CheckIntervalUnitsEnum;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: true })
  disableAfterTriggering: boolean;

  @ManyToOne(() => Template, (template) => template.orders, { eager: false })
  template: Template;

  @ManyToOne(() => User, (user) => user.orders, { eager: false })
  user: User;

  @OneToMany(() => OrderHistory, (orderHistory) => orderHistory.order)
  history: OrderHistory[];
}
