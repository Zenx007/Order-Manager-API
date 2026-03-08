import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Item } from '../Item/Item.entity';
import { User } from '../User/User.entity';

@Entity('Order')
export class Order {
  @AutoMap()
  @PrimaryColumn()
  orderId: string;

  @AutoMap()
  @Column()
  userId: string;

  @AutoMap()
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @AutoMap()
  @Column({ type: 'timestamp' })
  creationDate: Date;

  @AutoMap(() => Item)
  @OneToMany(() => Item, (item) => item.order)
  items: Item[];

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;
}
