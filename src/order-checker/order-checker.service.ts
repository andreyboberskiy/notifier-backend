import {
  forwardRef,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import analytic from 'analytic';
import { NotificationService } from 'notification/notification.service';
import { OrderHistoryService } from 'order-history/order-history.service';
import { Order } from 'order/entity/order.entity';
import { OrderService } from 'order/order.service';
import { ParserService } from 'parser/parser.service';
import {
  convertTimeValuesToSeconds,
  getOrderIntervalName,
  replaceValues,
} from 'utils';

@Injectable()
export class OrderCheckerService implements OnApplicationBootstrap {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private parserService: ParserService,
    private orderHistoryService: OrderHistoryService,
    private notificationService: NotificationService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  async startCheckingAllOrder() {
    const orders = await this.orderService.getAllOrderForChecking();

    orders.forEach((order) => this.addOrderForChecking(order));
  }

  async onApplicationBootstrap() {
    await this.startCheckingAllOrder();
  }

  generateOrderChecker(
    order: Order,
    intervalName: string,
  ): () => Promise<boolean> {
    return async () => {
      console.log('Check order ', order);
      const newValue = await this.parserService.getDataBySingleSelector(
        order.parseUrl,
        order.template.selector,
      );

      if (newValue !== order.compareValue) {
        await this.orderHistoryService.addHistory({
          title: 'Order triggered',
          description: 'Order was triggered by new value: ' + newValue,
          order,
        });

        await this.notificationService.sendNotification({
          title: replaceValues(order.notifyPhrase, [
            { template: '<>value</>', value: newValue },
          ]),
          user: order.user,
        });

        analytic.send('Order triggered', order.user.id);

        order.active = false;
        await order.save();

        this.schedulerRegistry.deleteInterval(intervalName);

        // triggered
        return true;
      }
      // not triggered
      return false;
    };
  }

  async addOrderForChecking(order: Order) {
    const intervalName = getOrderIntervalName(order.id);
    const callback = this.generateOrderChecker(order, intervalName);

    const triggered = await callback();

    if (!triggered) {
      const interval = setInterval(
        callback,
        convertTimeValuesToSeconds(
          order.checkInterval,
          order.checkIntervalUnit,
        ) * 1000,
      );
      this.schedulerRegistry.addInterval(intervalName, interval);
    }
  }
}
