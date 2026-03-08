import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import {
  ChangePasswordVO,
  LoginVO,
  UserReturnVO,
  UserTokenVO,
  UserUpdateVO,
  UserVO,
} from '../../Communication/ViewObjects/UserVO';
import { QueryRequest } from '../../Helpers/CustomObjects/QueryRequest';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';

export abstract class IUserService {
  abstract saveAsync(user: UserVO): Task<Result<UserTokenVO>>;
  abstract loginAsync(model: LoginVO): Task<Result<UserTokenVO>>;
  abstract updateAsync(
    id: string,
    user: UserUpdateVO,
  ): Task<Result<UserReturnVO>>;
  abstract deleteAsync(id: string): Task<Result<boolean>>;
  abstract findByIdAsync(id: string): Task<Result<UserReturnVO | null>>;
  abstract getAllAsync(): Task<Result<UserReturnVO[]>>;
  abstract getAllPagedAsync(
    query: QueryRequest,
  ): Task<Result<PagedList<UserReturnVO>>>;
  abstract deleteSelfAsync(id: string): Task<Result<boolean>>;
  abstract updateSelfAsync(
    id: string,
    user: UserUpdateVO,
  ): Task<Result<UserReturnVO>>;
  abstract promoteAsync(id: string): Task<Result<UserReturnVO>>;
  abstract demoteAsync(id: string): Task<Result<UserReturnVO>>;
  abstract changePasswordAsync(
    userId: string,
    model: ChangePasswordVO,
  ): Task<Result<boolean>>;
}
