import analytic from 'analytic';
import { Order } from 'order/entity/order.entity';
import { replaceValues } from 'utils';

const generateSingleValueChecker =
  ({
    parserService,
    orderHistoryService,
    notificationService,
    orderCheckerService,
  }) =>
  async (order: Order): Promise<boolean> => {
    console.log('Check order ', order.id);
    const newValue = await parserService.getDataBySingleSelector(
      order.parseUrl,
      order.template.selector,
    );
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
        await order.save();

        await orderCheckerService.removeOrderFromChecking(order.id);
      }

      // triggered
      return true;
    }
    // not triggered
    return false;
  };

export default generateSingleValueChecker;
