import { User } from '../Entities/User/User.entity';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';
import { QueryRequest } from '../../Helpers/CustomObjects/QueryRequest';

export abstract class IUserRepository {
  abstract findAllAsync(): Task<Result<User[]>>;
  abstract findAllPagedAsync(
    query: QueryRequest,
  ): Task<Result<PagedList<User>>>;
  abstract findByEmailAsync(email: string): Task<Result<User | null>>;
  abstract findByIdAsync(id: string): Task<Result<User | null>>;
  abstract insertAsync(user: Partial<User>): Task<Result<User>>;
  abstract updateAsync(
    id: string,
    user: Partial<User>,
  ): Task<Result<User | null>>;
  abstract deleteAsync(id: string): Task<Result<boolean>>;
}
