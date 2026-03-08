import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Role } from '../../Enums/Role.enum';
import { Order } from '../Order/Order.entity';

@Entity('Users')
export class User {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @AutoMap()
  @Column()
  Name: string;

  @AutoMap()
  @Column({ unique: true })
  Email: string;

  @AutoMap()
  @Column()
  Senha: string;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  Role: Role;

  @AutoMap(() => Order)
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
