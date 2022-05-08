import { Body, Controller, Post } from '@nestjs/common';
import { GetUserId } from 'auth/decorators';
import { CreateOrderDto } from 'order/dto/create-order.dto';
import { Order } from 'order/entity/order.entity';
import { OrderService } from 'order/order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/create')
  create(
    @GetUserId() userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.create(userId, createOrderDto);
  }
}
