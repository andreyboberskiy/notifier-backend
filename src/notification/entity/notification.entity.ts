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

  @ManyToOne(() => User)
  user: User;
}
