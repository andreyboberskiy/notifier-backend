import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetHistoryListDto } from 'order-history/dto/get-history-list.dto';
import { OrderHistory } from 'order-history/entity/order-history.entity';
import { OrderHistoryService } from 'order-history/order-history.service';

@ApiTags('order-history')
@ApiBearerAuth()
@Controller('order-history')
export class OrderHistoryController {
  constructor(private orderHistoryService: OrderHistoryService) {}
  @Get(':orderId')
  getHistoryList(
    @Query() getHistoryListDto: GetHistoryListDto,
    @Param() params,
  ): Promise<OrderHistory[]> {
    return this.orderHistoryService.getHistoryList(
      params.orderId,
      getHistoryListDto,
    );
  }
}
