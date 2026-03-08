import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Request,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse as ApiSwaggerResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  ChangePasswordVO,
  LoginVO,
  UserReturnVO,
  UserTokenVO,
  UserUpdateVO,
  UserVO,
} from '../../Communication/ViewObjects/UserVO';
import { IUserService } from '../../Core/ServicesInterface/IUserService.interface';
import { ApiResponse } from '../../Helpers/CustomObjects/ApiResponse.interface';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { StatusCode, StatusCodes } from '../../Helpers/StatusCode/StatusCode';
import { AuthGuard } from '../../Core/Guards/auth.guard';
import { ConstantsMessageUser } from '../../Helpers/ConstantsMessages/ConstantsMessages';
import { Roles } from '../../Core/Decorators/roles.decorator';
import { Role } from '../../Core/Enums/Role.enum';
import { RolesGuard } from '../../Core/Guards/roles.guard';
import { QueryRequest } from '../../Helpers/CustomObjects/QueryRequest';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';

@ApiTags('User')
@Controller('user')
@ApiExtraModels(ApiResponse, UserReturnVO)
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Post('save')
  @ApiOperation({
    summary: 'save - Método que cria um novo usuário',
  })
  @ApiSwaggerResponse({ type: UserTokenVO })
  async save(@Res() res: Response, @Body() model: UserVO): Task<Response> {
    const response = new ApiResponse<UserTokenVO>();
    try {
      const result = await this.userService.saveAsync(model);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessInsert;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_201_CREATED, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorInsert;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'login - Autentica via Usuário/Senha',
  })
  @ApiSwaggerResponse({ type: UserTokenVO })
  async login(@Res() res: Response, @Body() model: LoginVO): Task<Response> {
    const response = new ApiResponse<UserTokenVO>();
    try {
      const result = await this.userService.loginAsync(model);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_401_UNAUTHORIZED, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessLogin;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorLoginFailed;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Get('userInfo')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'userInfo - Método que busca os detalhes do usuário logado',
  })
  @ApiSwaggerResponse({ type: UserReturnVO })
  async userInfo(
    @Res() res: Response,
    @Request() request: any,
  ): Task<Response> {
    const response = new ApiResponse<UserReturnVO>();
    try {
      const userId = request.user.sub;
      const userResult = await this.userService.findByIdAsync(userId);

      if (userResult.isFailed || !userResult.value) {
        response.message = ConstantsMessageUser.ErrorNotFound;
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_404_NOT_FOUND, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessGetInfo;
      response.object = userResult.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorGetInfo;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'update - Método que atualiza um usuário (Apenas Admin)',
  })
  @ApiSwaggerResponse({ type: UserReturnVO })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() model: UserUpdateVO,
  ): Task<Response> {
    const response = new ApiResponse<UserReturnVO>();
    try {
      const result = await this.userService.updateAsync(id, model);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessUpdate;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorUpdate;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'delete - Método que deleta um usuário (Apenas Admin)',
  })
  async delete(@Res() res: Response, @Param('id') id: string): Task<Response> {
    const response = new ApiResponse<boolean>();
    try {
      const result = await this.userService.deleteAsync(id);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessDelete;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorDelete;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Get('getAll')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'getAll - Lista todos os usuários do sistema (Apenas Admin)',
  })
  @ApiSwaggerResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponse) },
        {
          properties: {
            object: {
              type: 'array',
              items: { $ref: getSchemaPath(UserReturnVO) },
            },
          },
        },
      ],
    },
  })
  async getAll(@Res() res: Response): Task<Response> {
    const response = new ApiResponse<UserReturnVO[]>();
    try {
      const result = await this.userService.getAllAsync();

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessGetAll;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorGetAll;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Get('paged')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'paged - Lista usuários com paginação e ordenação (Apenas Admin)',
  })
  @ApiSwaggerResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponse) },
        {
          properties: {
            object: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(UserReturnVO) },
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                lastPage: { type: 'number' },
              },
            },
          },
        },
      ],
    },
  })
  async getPaged(
    @Res() res: Response,
    @Query() query: QueryRequest,
  ): Task<Response> {
    const response = new ApiResponse<PagedList<UserReturnVO>>();
    try {
      const result = await this.userService.getAllPagedAsync(query);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessGetAll;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorGetAll;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Delete('deleteSelf')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'deleteSelf - Deleta a conta do usuário logado',
  })
  async deleteSelf(
    @Res() res: Response,
    @Request() request: any,
  ): Task<Response> {
    const response = new ApiResponse<boolean>();
    try {
      const userId = request.user.sub;
      const result = await this.userService.deleteSelfAsync(userId);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessDeleteSelf;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorDeleteSelf;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Put('updateSelf')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'updateSelf - Atualiza os dados do usuário logado',
  })
  @ApiSwaggerResponse({ type: UserReturnVO })
  async updateSelf(
    @Res() res: Response,
    @Request() request: any,
    @Body() model: UserUpdateVO,
  ): Task<Response> {
    const response = new ApiResponse<UserReturnVO>();
    try {
      const userId = request.user.sub;
      const result = await this.userService.updateSelfAsync(userId, model);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessUpdateSelf;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorUpdateSelf;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Post('promote/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'promote - Promove um usuário a Admin (Apenas Admin)',
  })
  @ApiSwaggerResponse({ type: UserReturnVO })
  async promote(@Res() res: Response, @Param('id') id: string): Task<Response> {
    const response = new ApiResponse<UserReturnVO>();
    try {
      const result = await this.userService.promoteAsync(id);
      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }
      response.success = true;
      response.message = ConstantsMessageUser.SuccessPromote;
      response.object = result.value;
      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorPromote;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Post('demote/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'demote - Remove permissões de Admin de um usuário (Apenas Admin)',
  })
  @ApiSwaggerResponse({ type: UserReturnVO })
  async demote(@Res() res: Response, @Param('id') id: string): Task<Response> {
    const response = new ApiResponse<UserReturnVO>();
    try {
      const result = await this.userService.demoteAsync(id);
      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }
      response.success = true;
      response.message = ConstantsMessageUser.SuccessDemote;
      response.object = result.value;
      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorDemote;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Put('changePassword')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'changePassword - Altera a senha do usuário logado',
  })
  async changePassword(
    @Res() res: Response,
    @Request() request: any,
    @Body() model: ChangePasswordVO,
  ): Task<Response> {
    const response = new ApiResponse<boolean>();
    try {
      const userId = request.user.sub;
      const result = await this.userService.changePasswordAsync(userId, model);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageUser.SuccessPasswordUpdate;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageUser.ErrorPasswordUnexpected;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }
}
