import { Order } from 'order/entity/order.entity';
import { ParseTypeEnum } from 'template/types/parse-type-enums.type';
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
    enum: ParseTypeEnum,
  })
  parseType: ParseTypeEnum;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  grabConfig: { label: string; selector: string }[];

  @Column('varchar', {
    array: true,
    default: [],
    nullable: false,
  })
  excludedSelectors: string[];

  @Column({ type: 'varchar', length: 200 })
  notifyPhrase: string;

  @ManyToOne(() => User, { nullable: true })
  author: User | number;

  @OneToMany(() => Order, (order) => order.template)
  orders: Order[];
}
