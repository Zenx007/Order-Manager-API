import { Injectable, Inject } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Item } from '../../Core/Entities/Item/Item.entity';
import { IItemRepository } from '../../Core/RepositoriesInterface/IItemRepository.interface';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { ConstantsMessageItem } from '../../Helpers/ConstantsMessages/ConstantsMessages';

@Injectable()
export class ItemRepository extends IItemRepository {
  constructor(
    @Inject('ITEM_REPOSITORY')
    private readonly itemRepository: Repository<Item>,
  ) {
    super();
  }

  async insertAsync(item: Item, manager?: EntityManager): Task<Result<Item>> {
    try {
      const repo = manager ? manager.getRepository(Item) : this.itemRepository;
      const newItem = await repo.save(item);

      return Result.Ok(newItem);
    } catch (error) {
      return Result.Fail(ConstantsMessageItem.ErrorInsert);
    }
  }

  async insertManyAsync(
    items: Item[],
    manager?: EntityManager,
  ): Task<Result<Item[]>> {
    try {
      const repo = manager ? manager.getRepository(Item) : this.itemRepository;
      await repo.insert(items);

      return Result.Ok(items);
    } catch (error) {
      return Result.Fail(ConstantsMessageItem.ErrorInsertMany);
    }
  }

  async deleteByOrderIdAsync(
    orderId: string,
    manager?: EntityManager,
  ): Task<Result<boolean>> {
    try {
      const repo = manager ? manager.getRepository(Item) : this.itemRepository;
      await repo.delete({ orderId });

      return Result.Ok(true);
    } catch (error) {
      return Result.Fail(ConstantsMessageItem.ErrorDeleteByOrder);
    }
  }

  async findByOrderIdAsync(orderId: string): Task<Result<Item[]>> {
    try {
      const items = await this.itemRepository.find({ where: { orderId } });

      return Result.Ok(items);
    } catch (error) {
      return Result.Fail(ConstantsMessageItem.ErrorFindByOrder);
    }
  }
}
