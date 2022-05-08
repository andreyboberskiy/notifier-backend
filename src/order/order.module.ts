import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCheckerModule } from 'order-checker/order-checker.module';
import { OrderHistoryModule } from 'order-history/order-history.module';
import { Order } from 'order/entity/order.entity';
import { ParserModule } from 'parser/parser.module';
import { TemplateModule } from 'template/template.module';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    OrderHistoryModule,
    ParserModule,
    TemplateModule,
    forwardRef(() => OrderCheckerModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
