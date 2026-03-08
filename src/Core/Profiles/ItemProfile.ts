import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Item } from '../Entities/Item/Item.entity';
import { ItemVO } from '../../Communication/ViewObjects/OrderVO';

@Injectable()
export class ItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Item,
        ItemVO,
        forMember(
          (d) => d.idItem,
          mapFrom((s) => s.productId),
        ),
        forMember(
          (d) => d.quantidadeItem,
          mapFrom((s) => s.quantity),
        ),
        forMember(
          (d) => d.valorItem,
          mapFrom((s) => s.price),
        ),
      );

      createMap(
        mapper,
        ItemVO,
        Item,
        forMember(
          (d) => d.productId,
          mapFrom((s) => s.idItem),
        ),
        forMember(
          (d) => d.quantity,
          mapFrom((s) => s.quantidadeItem),
        ),
        forMember(
          (d) => d.price,
          mapFrom((s) => s.valorItem),
        ),
      );
    };
  }
}
