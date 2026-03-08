import { Injectable, Inject } from '@nestjs/common';
import {
  Between,
  EntityManager,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Order } from '../../Core/Entities/Order/Order.entity';
import { IOrderRepository } from '../../Core/RepositoriesInterface/IOrderRepository.interface';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { ConstantsMessageOrder } from '../../Helpers/ConstantsMessages/ConstantsMessages';
import { OrderQueryRequest } from '../../Helpers/CustomObjects/QueryRequest';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';

@Injectable()
export class OrderRepository extends IOrderRepository {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Order>,
  ) {
    super();
  }

  async findAllAsync(userId?: string): Task<Result<Order[]>> {
    try {
      const where: FindOptionsWhere<Order> = {};
      if (userId) {
        where.userId = userId;
      }

      const orders = await this.orderRepository.find({
        where,
        relations: ['items', 'user'],
      });
      return Result.Ok(orders);
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorGetAll);
    }
  }

  async findAllPagedAsync(
    query: OrderQueryRequest,
  ): Task<Result<PagedList<Order>>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'creationDate',
        sortOrder = 'DESC',
        startDate,
        endDate,
        minTotalValue,
        maxTotalValue,
        userId,
      } = query;

      const where: FindOptionsWhere<Order> = {};

      if (userId) where.userId = userId;

      if (startDate && endDate) {
        where.creationDate = Between(new Date(startDate), new Date(endDate));
      } else if (startDate) {
        where.creationDate = MoreThanOrEqual(new Date(startDate));
      } else if (endDate) {
        where.creationDate = LessThanOrEqual(new Date(endDate));
      }

      if (minTotalValue !== undefined && maxTotalValue !== undefined) {
        where.value = Between(minTotalValue, maxTotalValue);
      } else if (minTotalValue !== undefined) {
        where.value = MoreThanOrEqual(minTotalValue);
      } else if (maxTotalValue !== undefined) {
        where.value = LessThanOrEqual(maxTotalValue);
      }

      const order: FindOptionsOrder<Order> = {
        [sortBy]: sortOrder,
      };

      const [data, total] = await this.orderRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        relations: ['items', 'user'],
      });

      const pagedList: PagedList<Order> = {
        data,
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      };

      return Result.Ok(pagedList);
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorGetAll);
    }
  }

  async findByIdAsync(id: string): Task<Result<Order | null>> {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: id },
        relations: ['items', 'user'],
      });
      return Result.Ok(order);
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorGetById);
    }
  }

  async insertAsync(
    order: Partial<Order>,
    manager?: EntityManager,
  ): Task<Result<Order>> {
    try {
      const repo = manager
        ? manager.getRepository(Order)
        : this.orderRepository;
      await repo.insert(order);
      return Result.Ok(order as Order);
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorInsert);
    }
  }
  async updateAsync(
    id: string,
    order: Partial<Order>,
    manager?: EntityManager,
  ): Task<Result<Order | null>> {
    try {
      const repo = manager
        ? manager.getRepository(Order)
        : this.orderRepository;

      const existingOrder = await repo.findOne({ where: { orderId: id } });
      if (!existingOrder) {
        return Result.Fail(ConstantsMessageOrder.ErrorNotFound);
      }

      await repo.update(id, {
        value: order.value,
        creationDate: order.creationDate,
        userId: order.userId,
      });

      const updatedOrder = await repo.findOne({
        where: { orderId: id },
        relations: ['items', 'user'],
      });

      return Result.Ok(updatedOrder);
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorUpdate);
    }
  }

  async deleteAsync(
    id: string,
    manager?: EntityManager,
  ): Task<Result<boolean>> {
    try {
      const repo = manager
        ? manager.getRepository(Order)
        : this.orderRepository;
      const result = await repo.delete(id);
      return Result.Ok((result.affected ?? 0) > 0);
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorDelete);
    }
  }
}
