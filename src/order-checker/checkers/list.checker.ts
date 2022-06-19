import analytic from 'analytic';
import { NotificationService } from 'notification/notification.service';
import { OrderCheckerService } from 'order-checker/order-checker.service';
import { OrderHistoryService } from 'order-history/order-history.service';
import { Order } from 'order/entity/order.entity';
import { ParserService } from 'parser/parser.service';
import { ParseTypeEnum } from 'template/types/parse-type-enums.type';
import { replaceValues } from 'utils';

const generateListChecker =
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
  async (order: Order): Promise<boolean> => {
    console.log('Check order list', order.id);
    const { compareValue: newValue } = await parserService.getCheckData({
      parseType: ParseTypeEnum.list,
      siteUrl: order.parseUrl,
      selector: order.template.selector,
      grabConfig: order.template.grabConfig,
      excludedSelectors: order.template.excludedSelectors,
    });
    if (newValue !== order.compareValue) {
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
      });

      analytic.send('Order triggered', order.user.id);

      if (order.disableAfterTriggering) {
        order.active = false;

        await orderCheckerService.removeOrderFromChecking(order.id);
      }

      order.compareValue = newValue;
      await order.save();

      // triggered
      return true;
    }
    // not triggered
    return false;
  };

export default generateListChecker;
