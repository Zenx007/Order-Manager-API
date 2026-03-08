import { orderProvider } from '../../Core/Entities/Order/Order.provider';
import { userProvider } from '../../Core/Entities/User/User.provider';
import { itemProvider } from '../../Core/Entities/Item/Item.provider';
import { IUserRepository } from '../../Core/RepositoriesInterface/IUserRepository.interface';
import { UserRepository } from '../../Infrastructure/Repositories/UserRepository.service';
import { IUserService } from '../../Core/ServicesInterface/IUserService.interface';
import { UserService } from '../../Infrastructure/Services/UserService.service';
import { IOrderRepository } from '../../Core/RepositoriesInterface/IOrderRepository.interface';
import { OrderRepository } from '../../Infrastructure/Repositories/OrderRepository.service';
import { IOrderService } from '../../Core/ServicesInterface/IOrderService.interface';
import { OrderService } from '../../Infrastructure/Services/OrderService.service';
import { IItemRepository } from '../../Core/RepositoriesInterface/IItemRepository.interface';
import { ItemRepository } from '../../Infrastructure/Repositories/ItemRepository.service';

const AddProviders: any[] = [
  ...userProvider,
  ...orderProvider,
  ...itemProvider,
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
  {
    provide: IUserService,
    useClass: UserService,
  },
  {
    provide: IOrderRepository,
    useClass: OrderRepository,
  },
  {
    provide: IOrderService,
    useClass: OrderService,
  },
  {
    provide: IItemRepository,
    useClass: ItemRepository,
  },
];

export default AddProviders;
