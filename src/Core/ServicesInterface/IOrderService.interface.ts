import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import {
  OrderReturnAdmVO,
  OrderVO,
} from '../../Communication/ViewObjects/OrderVO';
import { Role } from '../Enums/Role.enum';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';
import { OrderQueryRequest } from '../../Helpers/CustomObjects/QueryRequest';

export abstract class IOrderService {
  abstract saveAsync(model: OrderVO, userId: string): Task<Result<OrderVO>>;
  abstract getAllAsync(
    userId: string,
    role: Role,
  ): Task<Result<OrderVO[] | OrderReturnAdmVO[]>>;
  abstract getAllPagedAsync(
    query: OrderQueryRequest,
    userId: string,
    role: Role,
  ): Task<Result<PagedList<OrderVO | OrderReturnAdmVO>>>;
  abstract getByIdAsync(
    id: string,
    userId: string,
    role: Role,
  ): Task<Result<OrderVO | OrderReturnAdmVO | null>>;
  abstract updateAsync(
    id: string,
    model: OrderVO,
    userId: string,
    role: Role,
  ): Task<Result<OrderVO | null>>;
  abstract deleteAsync(
    id: string,
    userId: string,
    role: Role,
  ): Task<Result<boolean>>;
}
