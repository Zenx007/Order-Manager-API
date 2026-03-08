import { DataSource } from 'typeorm';
import { Item } from './Item.entity';

export const itemProvider = [
  {
    provide: 'ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Item),
    inject: [DataSource],
  },
];
