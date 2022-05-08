import { Order } from 'order/entity/order.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'user/entity/user.entity';

@Entity()
export class Template extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ type: 'varchar' })
  siteUrl: string;

  @Column({ type: 'varchar' })
  selector: string;

  @Column({ type: 'boolean', default: true })
  draft: boolean;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @Column({ type: 'varchar', length: 200 })
  notifyPhrase: string;

  @ManyToOne(() => User, { nullable: true })
  author: User | number;

  @OneToMany(() => Order, (order) => order.template)
  orders: Order[];
}
