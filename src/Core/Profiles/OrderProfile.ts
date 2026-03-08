import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Order } from '../Entities/Order/Order.entity';
import {
  OrderReturnAdmVO,
  OrderVO,
} from '../../Communication/ViewObjects/OrderVO';

@Injectable()
export class OrderProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Order,
        OrderVO,
        forMember(
          (d) => d.numeroPedido,
          mapFrom((s) => s.orderId),
        ),
        forMember(
          (d) => d.valorTotal,
          mapFrom((s) => s.value),
        ),
        forMember(
          (d) => d.dataCriacao,
          mapFrom((s) => s.creationDate?.toISOString()),
        ),
      );

      createMap(
        mapper,
        Order,
        OrderReturnAdmVO,
        forMember(
          (d) => d.numeroPedido,
          mapFrom((s) => s.orderId),
        ),
        forMember(
          (d) => d.valorTotal,
          mapFrom((s) => s.value),
        ),
        forMember(
          (d) => d.dataCriacao,
          mapFrom((s) => s.creationDate?.toISOString()),
        ),
        forMember(
          (d) => d.userName,
          mapFrom((s) => s.user?.Name),
        ),
        forMember(
          (d) => d.userEmail,
          mapFrom((s) => s.user?.Email),
        ),
      );

      createMap(
        mapper,
        OrderVO,
        Order,
        forMember(
          (d) => d.orderId,
          mapFrom((s) => s.numeroPedido),
        ),
        forMember(
          (d) => d.value,
          mapFrom((s) => s.valorTotal),
        ),
        forMember(
          (d) => d.creationDate,
          mapFrom((s) =>
            s.dataCriacao ? new Date(s.dataCriacao) : new Date(),
          ),
        ),
      );
    };
  }
}
