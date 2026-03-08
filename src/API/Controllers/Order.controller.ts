import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  UseGuards,
  Param,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse as ApiSwaggerResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  OrderReturnAdmVO,
  OrderVO,
} from '../../Communication/ViewObjects/OrderVO';
import { IOrderService } from '../../Core/ServicesInterface/IOrderService.interface';
import { ApiResponse } from '../../Helpers/CustomObjects/ApiResponse.interface';
import { Task } from '../../Helpers/CustomObjects/Task.Interface';
import { StatusCode, StatusCodes } from '../../Helpers/StatusCode/StatusCode';
import { AuthGuard } from '../../Core/Guards/auth.guard';
import { ConstantsMessageOrder } from '../../Helpers/ConstantsMessages/ConstantsMessages';
import { Role } from '../../Core/Enums/Role.enum';
import { OrderQueryRequest } from '../../Helpers/CustomObjects/QueryRequest';
import { PagedList } from '../../Helpers/CustomObjects/List.Interface';

@ApiTags('Order')
@Controller('order')
@UseGuards(AuthGuard)
@ApiBearerAuth('authorization')
@ApiExtraModels(ApiResponse, OrderVO, OrderReturnAdmVO)
export class OrderController {
  constructor(private readonly orderService: IOrderService) {}

  @Post()
  @ApiOperation({ summary: 'save - Cria um novo pedido' })
  @ApiSwaggerResponse({ type: OrderVO })
  async save(
    @Res() res: Response,
    @Body() model: OrderVO,
    @Request() req: any,
  ): Task<Response> {
    const response = new ApiResponse<OrderVO>();
    try {
      const userId = req.user.sub;
      const result = await this.orderService.saveAsync(model, userId);

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageOrder.SuccessInsert;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_201_CREATED, response);
    } catch (error) {
      const response = new ApiResponse<OrderVO>();
      response.success = false;
      response.message = ConstantsMessageOrder.ErrorInsert;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Get('paged')
  @ApiOperation({ summary: 'getPaged - Lista pedidos com paginação e filtros' })
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
                  items: {
                    oneOf: [
                      { $ref: getSchemaPath(OrderVO) },
                      { $ref: getSchemaPath(OrderReturnAdmVO) },
                    ],
                  },
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
    @Query() query: OrderQueryRequest,
    @Request() req: any,
  ): Task<Response> {
    const response = new ApiResponse<PagedList<OrderVO | OrderReturnAdmVO>>();
    try {
      const result = await this.orderService.getAllPagedAsync(
        query,
        req.user.sub,
        req.user.role,
      );

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageOrder.SuccessGetAll;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageOrder.ErrorGetAll;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'getAll - Lista todos os pedidos (Admin vê tudo)' })
  @ApiSwaggerResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponse) },
        {
          properties: {
            object: {
              type: 'array',
              items: {
                oneOf: [
                  { $ref: getSchemaPath(OrderVO) },
                  { $ref: getSchemaPath(OrderReturnAdmVO) },
                ],
              },
            },
          },
        },
      ],
    },
  })
  
  async getAll(@Res() res: Response, @Request() req: any): Task<Response> {
    const response = new ApiResponse<OrderVO[] | OrderReturnAdmVO[]>();
    try {
      const result = await this.orderService.getAllAsync(
        req.user.sub,
        req.user.role,
      );

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageOrder.SuccessGetAll;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageOrder.ErrorGetAll;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'getById - Busca um pedido pelo ID' })
  @ApiSwaggerResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(OrderVO) },
        { $ref: getSchemaPath(OrderReturnAdmVO) },
      ],
    },
  })
  async getById(
    @Res() res: Response,
    @Param('orderId') orderId: string,
    @Request() req: any,
  ): Task<Response> {
    const response = new ApiResponse<OrderVO | OrderReturnAdmVO>();
    try {
      const result = await this.orderService.getByIdAsync(
        orderId,
        req.user.sub,
        req.user.role,
      );

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        const status =
          result.errors[0] === ConstantsMessageOrder.ErrorUnauthorizedView
            ? StatusCodes.STATUS_403_FORBIDDEN
            : StatusCodes.STATUS_404_NOT_FOUND;
        return StatusCode(res, status, response);
      }

      if (!result.value) {
        response.message = ConstantsMessageOrder.ErrorNotFound;
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_404_NOT_FOUND, response);
      }

      response.success = true;
      response.message = ConstantsMessageOrder.SuccessGetById;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageOrder.ErrorGetById;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Put(':orderId')
  @ApiOperation({ summary: 'update - Atualiza um pedido' })
  @ApiSwaggerResponse({ type: OrderVO })
  async update(
    @Res() res: Response,
    @Param('orderId') orderId: string,
    @Body() model: OrderVO,
    @Request() req: any,
  ): Task<Response> {
    const response = new ApiResponse<OrderVO>();
    try {
      const result = await this.orderService.updateAsync(
        orderId,
        model,
        req.user.sub,
        req.user.role,
      );

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        const status =
          result.errors[0] === ConstantsMessageOrder.ErrorUnauthorizedUpdate
            ? StatusCodes.STATUS_403_FORBIDDEN
            : StatusCodes.STATUS_400_BAD_REQUEST;
        return StatusCode(res, status, response);
      }

      if (!result.value) {
        response.message = ConstantsMessageOrder.ErrorUpdate;
        response.success = false;
        return StatusCode(res, StatusCodes.STATUS_400_BAD_REQUEST, response);
      }

      response.success = true;
      response.message = ConstantsMessageOrder.SuccessUpdate;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageOrder.ErrorUpdate;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'delete - Remove um pedido' })
  async delete(
    @Res() res: Response,
    @Param('orderId') orderId: string,
    @Request() req: any,
  ): Task<Response> {
    const response = new ApiResponse<boolean>();
    try {
      const result = await this.orderService.deleteAsync(
        orderId,
        req.user.sub,
        req.user.role,
      );

      if (result.isFailed) {
        response.message = result.errors[0];
        response.success = false;
        const status =
          result.errors[0] === ConstantsMessageOrder.ErrorUnauthorizedDelete
            ? StatusCodes.STATUS_403_FORBIDDEN
            : StatusCodes.STATUS_400_BAD_REQUEST;
        return StatusCode(res, status, response);
      }

      response.success = true;
      response.message = ConstantsMessageOrder.SuccessDelete;
      response.object = result.value;

      return StatusCode(res, StatusCodes.STATUS_200_OK, response);
    } catch (error) {
      response.success = false;
      response.message = ConstantsMessageOrder.ErrorDelete;
      return StatusCode(
        res,
        StatusCodes.STATUS_500_INTERNAL_SERVER_ERROR,
        response,
      );
    }
  }
}
