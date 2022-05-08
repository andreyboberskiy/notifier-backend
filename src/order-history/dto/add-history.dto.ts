import { Order } from 'order/entity/order.entity';

export class AddHistoryDto {
  title: string;
  description: string;
  order: Order;
}
