import { Injectable, Inject } from '@nestjs/common';
import { FindOptionsOrder, Repository } from 'typeorm';
import { User } from '../../Core/Entities/User/User.entity';
import { IUserRepository } from '../../Core/RepositoriesInterface/IUserRepository.interface';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { ConstantsMessageUser } from '../../Helpers/ConstantsMessages/ConstantsMessages';
import { QueryRequest } from '../../Helpers/CustomObjects/QueryRequest';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async findAllAsync(): Task<Result<User[]>> {
    try {
      const users = await this.userRepository.find();
      return Result.Ok(users);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorGetAll);
    }
  }

  async findAllPagedAsync(query: QueryRequest): Task<Result<PagedList<User>>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'Name',
        sortOrder = 'ASC',
      } = query;

      const order: FindOptionsOrder<User> = {
        [sortBy]: sortOrder,
      };

      const [data, total] = await this.userRepository.findAndCount({
        order,
        take: limit,
        skip: (page - 1) * limit,
      });

      const pagedList: PagedList<User> = {
        data,
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      };

      return Result.Ok(pagedList);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorGetAll);
    }
  }

  async findByEmailAsync(email: string): Task<Result<User | null>> {
    try {
      const user = await this.userRepository.findOne({
        where: { Email: email },
      });
      return Result.Ok(user);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorNotFound);
    }
  }

  async findByIdAsync(id: string): Task<Result<User | null>> {
    try {
      const user = await this.userRepository.findOne({ where: { Id: id } });
      return Result.Ok(user);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorGetById);
    }
  }

  async insertAsync(user: User): Task<Result<User>> {
    try {
      const newUser = this.userRepository.create(user);
      const savedUser = await this.userRepository.save(newUser);
      return Result.Ok(savedUser);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorInsert);
    }
  }

  async updateAsync(
    id: string,
    user: Partial<User>,
  ): Task<Result<User | null>> {
    try {
      await this.userRepository.update(id, user);
      return this.findByIdAsync(id);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorUpdate);
    }
  }

  async deleteAsync(id: string): Task<Result<boolean>> {
    try {
      const result = await this.userRepository.delete(id);
      return Result.Ok((result.affected ?? 0) > 0);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorDelete);
    }
  }
}
