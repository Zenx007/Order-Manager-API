import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../Entities/User/User.entity';
import {
  UserDataVO,
  UserReturnVO,
  UserVO,
} from '../../Communication/ViewObjects/UserVO';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, User, UserVO);
      createMap(mapper, UserVO, User);
      createMap(mapper, User, UserReturnVO);
      createMap(mapper, User, UserDataVO);
    };
  }
}
