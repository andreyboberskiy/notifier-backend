import { Order } from 'order/entity/order.entity';
import { ParseTypeEnums } from 'template/types/parse-type-enums.type';
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

  // TODO: Implement CMS for template approving
  @Column({ type: 'boolean', default: true })
  approved: boolean;

  @Column({
    type: 'enum',
    enum: ParseTypeEnums,
    default: ParseTypeEnums.singleValue,
  })
  parseType: ParseTypeEnums;

  @Column({ type: 'varchar', length: 200 })
  notifyPhrase: string;

  @ManyToOne(() => User, { nullable: true })
  author: User | number;

  @OneToMany(() => Order, (order) => order.template)
  orders: Order[];
}
