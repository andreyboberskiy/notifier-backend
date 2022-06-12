import { forwardRef, Module } from '@nestjs/common';
import { NotificationModule } from 'notification/notification.module';
import { Checkers } from 'order-checker/checkers';
import { OrderHistoryModule } from 'order-history/order-history.module';
import { OrderModule } from 'order/order.module';
import { ParserModule } from 'parser/parser.module';
import { OrderCheckerService } from './order-checker.service';

@Module({
  imports: [
    OrderHistoryModule,
    NotificationModule,
    ParserModule,
    forwardRef(() => OrderModule),
  ],
  providers: [OrderCheckerService, Checkers],
  exports: [OrderCheckerService],
})
export class OrderCheckerModule {}
