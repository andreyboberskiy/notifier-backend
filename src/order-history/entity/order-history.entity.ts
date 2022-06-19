import { Order } from 'order/entity/order.entity';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Order, (order) => order.history)
  order: Order;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
