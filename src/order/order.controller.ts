import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, GetUserId } from 'auth/decorators';
import { CreateOrderDto } from 'order/dto/create-order.dto';
import { GetMyOrdersDto } from 'order/dto/get-my-orders.dto';
import { Order } from 'order/entity/order.entity';
import { OrderService } from 'order/order.service';
import { User } from 'user/entity/user.entity';

@ApiTags('order')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  create(
    @GetUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.create(user, createOrderDto);
  }

  @Put('/activate/:id')
  @HttpCode(HttpStatus.OK)
  activate(@GetUserId() userId: number, @Param() params): Promise<Order> {
    return this.orderService.toggleActivity(params.id, userId, true);
  }
  @Put('/deactivate/:id')
  @HttpCode(HttpStatus.OK)
  deactivate(@GetUserId() userId: number, @Param() params): Promise<Order> {
    return this.orderService.toggleActivity(params.id, userId, false);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  getMy(
    @Query() params: GetMyOrdersDto,
    @GetUserId() userId: number,
  ): Promise<Order[]> {
    return this.orderService.getMy(userId, params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@GetUserId() userId: number, @Param() params): Promise<Order> {
    return this.orderService.getById(userId, params.id);
  }
}
