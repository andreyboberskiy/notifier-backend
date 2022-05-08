import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddHistoryDto } from 'order-history/dto';
import { OrderHistory } from 'order-history/entity/order-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
  ) {}

  async addHistory(payload: AddHistoryDto) {
    const orderHistory = await this.orderHistoryRepository.create(payload);
    return orderHistory.save();
  }
}
