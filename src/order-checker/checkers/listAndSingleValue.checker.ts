import analytic from 'analytic';
import { NotificationService } from 'notification/notification.service';
import { NotificationTypeEnum } from 'notification/notification.types';
import { OrderCheckerService } from 'order-checker/order-checker.service';
import { OrderHistoryService } from 'order-history/order-history.service';
import { Order } from 'order/entity/order.entity';
import { ParserService } from 'parser/parser.service';
import { replaceValues } from 'utils';

const generateListAndSingleValueChecker =
  ({
    parserService,
    orderHistoryService,
    notificationService,
    orderCheckerService,
  }: {
    parserService: ParserService;
    orderHistoryService: OrderHistoryService;
    notificationService: NotificationService;
    orderCheckerService: OrderCheckerService;
  }) =>
  async (order: Order, skipNotification?: boolean): Promise<boolean> => {
    console.log('Check order: ', order.template.parseType, order.id);

    const { compareValue: newValue } = await parserService.getCheckData({
      parseType: order.template.parseType,
      siteUrl: order.parseUrl,
      selector: order.template.selector,
      grabConfig: order.template.grabConfig,
      excludedSelectors: order.template.excludedSelectors,
    });

    if (newValue !== order.compareValue) {
      order.compareValue = newValue;
      await order.save();
      if (skipNotification) {
        return true;
      }
      await orderHistoryService.addHistory({
        title: 'Order triggered',
        description: 'Order was triggered by new value: ' + newValue,
        order,
      });

      await notificationService.sendNotification({
        title: replaceValues(order.notifyPhrase, [
          { template: '<>value</>', value: newValue },
        ]),
        user: order.user,
        type: NotificationTypeEnum.orderTriggered,
        data: { orderId: order.id },
      });

      analytic.send('Order triggered', order.user.id);

      if (order.disableAfterTriggering) {
        order.active = false;
        await order.save();

        await orderCheckerService.removeOrderFromChecking(order.id);
      }

      // triggered
      return true;
    }
    // not triggered
    return false;
  };

export default generateListAndSingleValueChecker;
