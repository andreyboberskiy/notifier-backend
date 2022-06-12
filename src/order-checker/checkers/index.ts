import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotificationService } from 'notification/notification.service';
import generateSingleValueChecker from 'order-checker/checkers/singleValue.checker';
import { OrderCheckerService } from 'order-checker/order-checker.service';
import { OrderHistoryService } from 'order-history/order-history.service';
import { ParserService } from 'parser/parser.service';

@Injectable()
export class Checkers {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private parserService: ParserService,
    private orderHistoryService: OrderHistoryService,
    private orderCheckerService: OrderCheckerService,
    private notificationService: NotificationService,
  ) {}

  public singleValue = generateSingleValueChecker({
    parserService: this.parserService,
    orderCheckerService: this.orderCheckerService,
    notificationService: this.notificationService,
    orderHistoryService: this.orderHistoryService,
  });
}
