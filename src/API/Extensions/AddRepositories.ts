import { ItemRepository } from '../../Infrastructure/Repositories/ItemRepository.service';
import { OrderRepository } from '../../Infrastructure/Repositories/OrderRepository.service';
import { UserRepository } from '../../Infrastructure/Repositories/UserRepository.service';

const RepositoriesStartup = [UserRepository, OrderRepository, ItemRepository];

export default RepositoriesStartup;
