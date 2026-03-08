import { OrderService } from '../../Infrastructure/Services/OrderService.service';
import { UserService } from '../../Infrastructure/Services/UserService.service';

export const AllServicesInjects = [UserService, OrderService];

const ServicesStartup = [UserService, OrderService];

export default ServicesStartup;
