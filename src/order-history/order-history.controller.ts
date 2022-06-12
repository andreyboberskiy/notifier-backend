import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetHistoryListDto } from 'order-history/dto/get-history-list.dto';
import { OrderHistory } from 'order-history/entity/order-history.entity';
import { OrderHistoryService } from 'order-history/order-history.service';

@Controller('order-history')
export class OrderHistoryController {
  constructor(private orderHistoryService: OrderHistoryService) {}
  @Get(':id')
  getHistoryList(
    @Query() getHistoryListDto: GetHistoryListDto,
    @Param() params,
  ): Promise<OrderHistory[]> {
    return this.orderHistoryService.getHistoryList(
      params.id,
      getHistoryListDto,
    );
  }
}
