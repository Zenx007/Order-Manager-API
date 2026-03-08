import { Injectable, Inject } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { DataSource } from 'typeorm';
import { IOrderService } from '../../Core/ServicesInterface/IOrderService.interface';
import { IOrderRepository } from '../../Core/RepositoriesInterface/IOrderRepository.interface';
import { IItemRepository } from '../../Core/RepositoriesInterface/IItemRepository.interface';
import {
  OrderReturnAdmVO,
  OrderVO,
} from '../../Communication/ViewObjects/OrderVO';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { ConstantsMessageOrder } from '../../Helpers/ConstantsMessages/ConstantsMessages';
import { Order } from '../../Core/Entities/Order/Order.entity';
import { Item } from '../../Core/Entities/Item/Item.entity';
import { Role } from '../../Core/Enums/Role.enum';
import { OrderQueryRequest } from '../../Helpers/CustomObjects/QueryRequest';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    @Inject(IItemRepository)
    private readonly itemRepository: IItemRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly dataSource: DataSource,
  ) {}

  async saveAsync(model: OrderVO, userId: string): Task<Result<OrderVO>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingOrder = await this.orderRepository.findByIdAsync(
        model.numeroPedido,
      );
      if (existingOrder.isSuccess && existingOrder.value) {
        await queryRunner.rollbackTransaction();
        return Result.Fail('Já existe um pedido com este número.');
      }

      const orderEntity = this.mapper.map(model, OrderVO, Order);
      orderEntity.userId = userId;

      const itemsToSave = [...(orderEntity.items || [])];

      const productIds = itemsToSave.map((i) => i.productId);
      const hasDuplicates = productIds.some(
        (id, index) => productIds.indexOf(id) !== index,
      );

      if (hasDuplicates) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorIdItemDuplicated);
      }

      orderEntity.items = [];

      const orderResult = await this.orderRepository.insertAsync(
        orderEntity,
        queryRunner.manager,
      );

      if (orderResult.isFailed || !orderResult.value) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorInsert);
      }

      const savedOrder = orderResult.value;

      if (itemsToSave.length > 0) {
        const processedItems = itemsToSave.map((item) => {
          item.orderId = savedOrder.orderId;
          return item;
        });

        const itemsResult = await this.itemRepository.insertManyAsync(
          processedItems,
          queryRunner.manager,
        );

        if (itemsResult.isFailed) {
          await queryRunner.rollbackTransaction();
          return Result.Fail(ConstantsMessageOrder.ErrorInsertItems);
        }
        savedOrder.items = itemsResult.value!;
      }

      await queryRunner.commitTransaction();
      return Result.Ok(this.mapper.map(savedOrder, Order, OrderVO));
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === '23505') {
        return Result.Fail('Já existe um pedido com este número.');
      }

      return Result.Fail(ConstantsMessageOrder.ErrorInsert);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllAsync(
    userId: string,
    role: Role,
  ): Task<Result<OrderVO[] | OrderReturnAdmVO[]>> {
    try {
      const repositoryUserId = role === Role.ADMIN ? undefined : userId;
      const result = await this.orderRepository.findAllAsync(repositoryUserId);

      if (result.isFailed) {
        return Result.Fail(ConstantsMessageOrder.ErrorGetAll);
      }

      if (role === Role.ADMIN) {
        return Result.Ok(
          this.mapper.mapArray(result.value!, Order, OrderReturnAdmVO),
        );
      }

      return Result.Ok(this.mapper.mapArray(result.value!, Order, OrderVO));
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorGetAll);
    }
  }

  async getAllPagedAsync(
    query: OrderQueryRequest,
    userId: string,
    role: Role,
  ): Task<Result<PagedList<OrderVO | OrderReturnAdmVO>>> {
    try {
      if (role !== Role.ADMIN) {
        query.userId = userId;
      }

      const result = await this.orderRepository.findAllPagedAsync(query);

      if (result.isFailed) {
        return Result.Fail(ConstantsMessageOrder.ErrorGetAll);
      }

      const pagedListVO: PagedList<OrderVO | OrderReturnAdmVO> = {
        ...result.value!,
        data:
          role === Role.ADMIN
            ? this.mapper.mapArray(result.value!.data, Order, OrderReturnAdmVO)
            : this.mapper.mapArray(result.value!.data, Order, OrderVO),
      };

      return Result.Ok(pagedListVO);
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorGetAll);
    }
  }

  async getByIdAsync(
    id: string,
    userId: string,
    role: Role,
  ): Task<Result<OrderVO | OrderReturnAdmVO | null>> {
    try {
      const result = await this.orderRepository.findByIdAsync(id);

      if (result.isFailed || !result.value) {
        return Result.Ok(null);
      }

      if (role !== Role.ADMIN && result.value.userId !== userId) {
        return Result.Fail(ConstantsMessageOrder.ErrorUnauthorizedView);
      }

      if (role === Role.ADMIN) {
        return Result.Ok(
          this.mapper.map(result.value, Order, OrderReturnAdmVO),
        );
      }

      return Result.Ok(this.mapper.map(result.value, Order, OrderVO));
    } catch (error) {
      return Result.Fail(ConstantsMessageOrder.ErrorGetById);
    }
  }

  async updateAsync(
    id: string,
    model: OrderVO,
    userId: string,
    role: Role,
  ): Task<Result<OrderVO | null>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (model.numeroPedido !== id) {
        await queryRunner.rollbackTransaction();
        return Result.Fail('O número do pedido não pode ser alterado.');
      }

      const orderCheck = await this.orderRepository.findByIdAsync(id);
      if (orderCheck.isFailed || !orderCheck.value) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorNotFound);
      }

      if (role !== Role.ADMIN && orderCheck.value.userId !== userId) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorUnauthorizedUpdate);
      }

      const internalData = this.mapper.map(model, OrderVO, Order);
      internalData.orderId = id;
      const itemsToUpdate = [...(internalData.items || [])];

      const productIds = itemsToUpdate.map((i) => i.productId);
      const hasDuplicates = productIds.some(
        (id, index) => productIds.indexOf(id) !== index,
      );

      if (hasDuplicates) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(
          'Um pedido não pode conter o mesmo item (productId) mais de uma vez.',
        );
      }

      internalData.items = [];

      const orderResult = await this.orderRepository.updateAsync(
        id,
        internalData,
        queryRunner.manager,
      );

      if (orderResult.isFailed || !orderResult.value) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorUpdate);
      }

      const updatedOrder = orderResult.value;

      if (itemsToUpdate.length > 0) {
        await this.itemRepository.deleteByOrderIdAsync(id, queryRunner.manager);

        const processedItems = itemsToUpdate.map((item) => {
          item.orderId = id;
          return item;
        });

        const itemsResult = await this.itemRepository.insertManyAsync(
          processedItems,
          queryRunner.manager,
        );

        if (itemsResult.isFailed) {
          await queryRunner.rollbackTransaction();
          return Result.Fail(ConstantsMessageOrder.ErrorUpdate);
        }
        updatedOrder.items = processedItems;
      }

      await queryRunner.commitTransaction();
      return Result.Ok(this.mapper.map(updatedOrder, Order, OrderVO));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return Result.Fail(ConstantsMessageOrder.ErrorUpdate);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAsync(
    id: string,
    userId: string,
    role: Role,
  ): Task<Result<boolean>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderResult = await this.orderRepository.findByIdAsync(id);
      if (orderResult.isFailed || !orderResult.value) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorNotFound);
      }

      if (role !== Role.ADMIN && orderResult.value.userId !== userId) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorUnauthorizedDelete);
      }

      const deleteItems = await this.itemRepository.deleteByOrderIdAsync(
        id,
        queryRunner.manager,
      );
      if (deleteItems.isFailed) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorDelete);
      }

      const deleteOrder = await this.orderRepository.deleteAsync(
        id,
        queryRunner.manager,
      );
      if (deleteOrder.isFailed) {
        await queryRunner.rollbackTransaction();
        return Result.Fail(ConstantsMessageOrder.ErrorDelete);
      }

      await queryRunner.commitTransaction();
      return Result.Ok(true);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return Result.Fail(ConstantsMessageOrder.ErrorDelete);
    } finally {
      await queryRunner.release();
    }
  }
}
