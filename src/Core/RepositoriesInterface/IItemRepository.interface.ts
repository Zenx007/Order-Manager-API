import { EntityManager } from 'typeorm';
import { Item } from '../Entities/Item/Item.entity';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';

export abstract class IItemRepository {
  abstract insertAsync(item: Item, manager?: EntityManager): Task<Result<Item>>;
  abstract insertManyAsync(
    items: Item[],
    manager?: EntityManager,
  ): Task<Result<Item[]>>;
  abstract deleteByOrderIdAsync(
    orderId: string,
    manager?: EntityManager,
  ): Task<Result<boolean>>;
  abstract findByOrderIdAsync(orderId: string): Task<Result<Item[]>>;
}
