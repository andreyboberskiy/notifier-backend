import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Checkers } from 'order-checker/checkers';
import { Order } from 'order/entity/order.entity';
import { OrderService } from 'order/order.service';
import { ParseTypeEnum } from 'template/types/parse-type-enums.type';
import { convertTimeValuesToSeconds, getOrderIntervalName } from 'utils';

@Injectable()
export class OrderCheckerService implements OnApplicationBootstrap {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
    @Inject(forwardRef(() => Checkers))
    private checkers: Checkers,
  ) {}

  private async startCheckingAllOrder() {
    const orders = await this.orderService.getAllOrderForChecking();

    orders.forEach((order) => this.addOrderForChecking(order));
  }

  async onApplicationBootstrap() {
    await this.startCheckingAllOrder();
  }

  checkerByParseType = {
    [ParseTypeEnum.singleValue]: this.checkers.listAndSingleValueChecker,
    [ParseTypeEnum.list]: this.checkers.listAndSingleValueChecker,
  };

  private generateOrderChecker(
    order: Order,
  ): (skipNotification?: boolean) => Promise<boolean> {
    const checker = this.checkerByParseType[order.template.parseType];
    if (!checker) {
      throw new BadRequestException(
        'Cant check template with this parse type: ' + order.template.parseType,
      );
    }
    return (skipNotification) => {
      return checker(order, skipNotification);
    };
  }
  public async removeOrderFromChecking(orderId: number) {
    const intervalName = getOrderIntervalName(orderId);
    this.schedulerRegistry.deleteInterval(intervalName);
    console.log(
      'Order removed from checking: ',
      orderId,
      this.schedulerRegistry.getIntervals(),
    );
  }

  public async addOrderForChecking(order: Order) {
    const intervalName = getOrderIntervalName(order.id);
    const callback = this.generateOrderChecker(order);

    await callback(true);

    console.log(
      convertTimeValuesToSeconds(order.checkInterval, order.checkIntervalUnit) *
        1000,
    );
    const interval = setInterval(
      callback,
      convertTimeValuesToSeconds(order.checkInterval, order.checkIntervalUnit) *
        1000,
    );

    this.schedulerRegistry.addInterval(intervalName, interval);
    console.log(
      'Order added for checking: ',
      order.id,
      this.schedulerRegistry.getIntervals(),
    );
  }
}
