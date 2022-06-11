import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GetUser, GetUserId } from 'auth/decorators';
import { CreateOrderDto } from 'order/dto/create-order.dto';
import { GetMyOrdersDto } from 'order/dto/get-my-orders.dto';
import { Order } from 'order/entity/order.entity';
import { OrderService } from 'order/order.service';
import { User } from 'user/entity/user.entity';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/create')
  create(
    @GetUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.create(user, createOrderDto);
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
