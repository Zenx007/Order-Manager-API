import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Order } from '../Order/Order.entity';

@Entity('Items')
export class Item {
  @AutoMap()
  @PrimaryColumn()
  orderId: string;

  @AutoMap()
  @PrimaryColumn()
  productId: number;

  @AutoMap()
  @Column('int')
  quantity: number;

  @AutoMap()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
