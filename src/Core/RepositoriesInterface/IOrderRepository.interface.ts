import { EntityManager } from 'typeorm';
import { Order } from '../Entities/Order/Order.entity';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';
import { OrderQueryRequest } from '../../Helpers/CustomObjects/QueryRequest';

export abstract class IOrderRepository {
  abstract findAllAsync(userId?: string): Task<Result<Order[]>>;
  abstract findAllPagedAsync(
    query: OrderQueryRequest,
  ): Task<Result<PagedList<Order>>>;
  abstract findByIdAsync(id: string): Task<Result<Order | null>>;
  abstract insertAsync(
    order: Partial<Order>,
    manager?: EntityManager,
  ): Task<Result<Order>>;
  abstract updateAsync(
    id: string,
    order: Partial<Order>,
    manager?: EntityManager,
  ): Task<Result<Order | null>>;
  abstract deleteAsync(
    id: string,
    manager?: EntityManager,
  ): Task<Result<boolean>>;
}
