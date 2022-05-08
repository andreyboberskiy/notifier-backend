import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistory } from 'order-history/entity/order-history.entity';
import { OrderHistoryController } from './order-history.controller';
import { OrderHistoryService } from './order-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistory])],
  controllers: [OrderHistoryController],
  providers: [OrderHistoryService],
  exports: [OrderHistoryService],
})
export class OrderHistoryModule {}
