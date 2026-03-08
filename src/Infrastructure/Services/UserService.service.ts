import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import * as bcrypt from 'bcrypt';
import { IUserService } from '../../Core/ServicesInterface/IUserService.interface';
import { IUserRepository } from '../../Core/RepositoriesInterface/IUserRepository.interface';
import {
  ChangePasswordVO,
  LoginVO,
  UserReturnVO,
  UserTokenVO,
  UserUpdateVO,
  UserVO,
} from '../../Communication/ViewObjects/UserVO';
import { Result } from '../../Helpers/CustomObjects/Result';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { ConstantsMessageUser } from '../../Helpers/ConstantsMessages/ConstantsMessages';
import { Role } from '../../Core/Enums/Role.enum';
import { User } from '../../Core/Entities/User/User.entity';
import { QueryRequest } from '../../Helpers/CustomObjects/QueryRequest';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async saveAsync(userVO: UserVO): Task<Result<UserTokenVO>> {
    try {
      const userExistsResult = await this.userRepository.findByEmailAsync(
        userVO.Email,
      );

      if (userExistsResult.isSuccess && userExistsResult.value) {
        return Result.Fail(ConstantsMessageUser.ErrorAlreadyExists);
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userVO.Senha, salt);

      const userEntity = this.mapper.map(userVO, UserVO, User);
      userEntity.Senha = hashedPassword;
      userEntity.Role = Role.USER;

      const createResult = await this.userRepository.insertAsync(userEntity);

      if (createResult.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorInsert);
      }

      const savedUser = createResult.value!;
      const payload = {
        sub: savedUser.Id,
        email: savedUser.Email,
        role: savedUser.Role,
      };
      const token = await this.jwtService.signAsync(payload);

      const response: UserTokenVO = {
        User: this.mapper.map(savedUser, User, UserReturnVO),
        Token: token,
      };

      return Result.Ok(response);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorInsert);
    }
  }

  async loginAsync(model: LoginVO): Task<Result<UserTokenVO>> {
    try {
      const userResult = await this.userRepository.findByEmailAsync(
        model.Email,
      );

      if (userResult.isFailed || !userResult.value) {
        return Result.Fail(ConstantsMessageUser.ErrorLogin);
      }

      const user = userResult.value;
      const isMatch = await bcrypt.compare(model.Senha, user.Senha);

      if (!isMatch) {
        return Result.Fail(ConstantsMessageUser.ErrorLogin);
      }

      const payload = { sub: user.Id, email: user.Email, role: user.Role };
      const token = await this.jwtService.signAsync(payload);

      const response: UserTokenVO = {
        User: this.mapper.map(user, User, UserReturnVO),
        Token: token,
      };

      return Result.Ok(response);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorLoginFailed);
    }
  }

  async updateAsync(
    id: string,
    userVO: UserUpdateVO,
  ): Task<Result<UserReturnVO>> {
    try {
      const userResult = await this.userRepository.findByIdAsync(id);

      if (userResult.isFailed || !userResult.value) {
        return Result.Fail(ConstantsMessageUser.ErrorNotFound);
      }

      const currentUser = userResult.value;

      if (userVO.Email !== currentUser.Email) {
        const emailExists = await this.userRepository.findByEmailAsync(
          userVO.Email,
        );
        if (
          emailExists.isSuccess &&
          emailExists.value &&
          emailExists.value.Id !== id
        ) {
          return Result.Fail(ConstantsMessageUser.ErrorAlreadyExists);
        }
      }

      const updateResult = await this.userRepository.updateAsync(id, {
        Name: userVO.Name,
        Email: userVO.Email,
      });

      if (updateResult.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorUpdate);
      }

      const updatedUser = updateResult.value!;

      const userResponse = this.mapper.map(updatedUser, User, UserReturnVO);

      return Result.Ok(userResponse);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorUpdate);
    }
  }

  async deleteAsync(id: string): Task<Result<boolean>> {
    try {
      const deleteResult = await this.userRepository.deleteAsync(id);

      if (deleteResult.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorDelete);
      }

      return Result.Ok(deleteResult.value);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorDelete);
    }
  }

  async findByIdAsync(id: string): Task<Result<UserReturnVO | null>> {
    try {
      const userResult = await this.userRepository.findByIdAsync(id);

      if (userResult.isFailed || !userResult.value) {
        return Result.Ok(null);
      }

      const userVO = this.mapper.map(userResult.value, User, UserReturnVO);

      return Result.Ok(userVO);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorGetById);
    }
  }

  async getAllAsync(): Task<Result<UserReturnVO[]>> {
    try {
      const usersResult = await this.userRepository.findAllAsync();

      if (usersResult.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorGetAllUsers);
      }

      const usersVO = this.mapper.mapArray(
        usersResult.value!,
        User,
        UserReturnVO,
      );

      return Result.Ok(usersVO);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorGetAllUsers);
    }
  }

  async getAllPagedAsync(
    query: QueryRequest,
  ): Task<Result<PagedList<UserReturnVO>>> {
    try {
      const result = await this.userRepository.findAllPagedAsync(query);

      if (result.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorGetAllUsers);
      }

      const pagedListVO: PagedList<UserReturnVO> = {
        ...result.value!,
        data: this.mapper.mapArray(result.value!.data, User, UserReturnVO),
      };

      return Result.Ok(pagedListVO);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorGetAllUsers);
    }
  }

  async deleteSelfAsync(id: string): Task<Result<boolean>> {
    try {
      const result = await this.deleteAsync(id);
      if (result.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorDeleteSelf);
      }
      return result;
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorDeleteSelf);
    }
  }

  async updateSelfAsync(
    id: string,
    userVO: UserUpdateVO,
  ): Task<Result<UserReturnVO>> {
    try {
      const result = await this.updateAsync(id, userVO);
      if (result.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorUpdateSelf);
      }
      return result;
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorUpdateSelf);
    }
  }

  async promoteAsync(id: string): Task<Result<UserReturnVO>> {
    try {
      const updateResult = await this.userRepository.updateAsync(id, {
        Role: Role.ADMIN,
      });

      if (updateResult.isFailed || !updateResult.value) {
        return Result.Fail(ConstantsMessageUser.ErrorPromote);
      }

      const userResponse = this.mapper.map(
        updateResult.value,
        User,
        UserReturnVO,
      );

      return Result.Ok(userResponse);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorPromote);
    }
  }

  async demoteAsync(id: string): Task<Result<UserReturnVO>> {
    try {
      const updateResult = await this.userRepository.updateAsync(id, {
        Role: Role.USER,
      });

      if (updateResult.isFailed || !updateResult.value) {
        return Result.Fail(ConstantsMessageUser.ErrorDemote);
      }

      const userResponse = this.mapper.map(
        updateResult.value,
        User,
        UserReturnVO,
      );

      return Result.Ok(userResponse);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorDemote);
    }
  }

  async changePasswordAsync(
    userId: string,
    model: ChangePasswordVO,
  ): Task<Result<boolean>> {
    try {
      if (model.NovaSenha !== model.ConfirmacaoSenha) {
        return Result.Fail(ConstantsMessageUser.ErrorPasswordNotMatch);
      }

      const userResult = await this.userRepository.findByIdAsync(userId);
      if (userResult.isFailed || !userResult.value) {
        return Result.Fail(ConstantsMessageUser.ErrorNotFound);
      }

      const user = userResult.value;
      const isMatch = await bcrypt.compare(model.SenhaAtual, user.Senha);
      if (!isMatch) {
        return Result.Fail(ConstantsMessageUser.ErrorPasswordIncorrect);
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(model.NovaSenha, salt);

      const updateResult = await this.userRepository.updateAsync(userId, {
        Senha: hashedPassword,
      });
      if (updateResult.isFailed) {
        return Result.Fail(ConstantsMessageUser.ErrorPasswordUpdate);
      }

      return Result.Ok(true);
    } catch (error) {
      return Result.Fail(ConstantsMessageUser.ErrorPasswordUnexpected);
    }
  }
}
