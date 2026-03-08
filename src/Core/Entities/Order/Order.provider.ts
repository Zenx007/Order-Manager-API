import { DataSource } from 'typeorm';
import { Order } from './Order.entity';

export const orderProvider = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: [DataSource],
  },
];
