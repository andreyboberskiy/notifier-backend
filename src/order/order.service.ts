import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import analytic from 'analytic';
import { OrderCheckerService } from 'order-checker/order-checker.service';
import { OrderHistoryService } from 'order-history/order-history.service';

import { CreateOrderDto } from 'order/dto/create-order.dto';
import { GetMyOrdersDto } from 'order/dto/get-my-orders.dto';
import { Order } from 'order/entity/order.entity';
import { ParserService } from 'parser/parser.service';
import { TemplateService } from 'template/template.service';
import { ParseTypeEnums } from 'template/types/parse-type-enums.type';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @Inject(forwardRef(() => OrderCheckerService))
    private orderCheckerService: OrderCheckerService,
    private parserService: ParserService,
    private orderHistoryService: OrderHistoryService,
    private templateService: TemplateService,
  ) {}

  async toggleActivity(orderId: number, userId: number, activate: boolean) {
    const order = await this.orderRepository.findOne({
      where: {
        user: { id: userId },
        id: orderId,
      },
      relations: ['template'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (activate) {
      if (order.active) {
        throw new BadRequestException('Order already active');
      }
      order.active = true;
      await order.save();
      await this.orderCheckerService.addOrderForChecking(order);
    } else {
      if (!order.active) {
        throw new BadRequestException('Order already inactive');
      }
      order.active = false;
      await order.save();
      await this.orderCheckerService.removeOrderFromChecking(order.id);
    }

    return order;
  }

  async getById(userId, orderId) {
    const order = await this.orderRepository.findOneBy({
      id: orderId,
      user: userId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getMy(userId, params: GetMyOrdersDto) {
    const { offset, limit = 10 } = params;

    const orders = await this.orderRepository.find({
      where: { user: userId },
      skip: offset,
      take: limit,
    });

    return orders;
  }

  async create(user, createOrderDto: CreateOrderDto) {
    const {
      url,
      templateId,
      checkIntervalUnit,
      checkInterval,
      name,
      notifyPhrase,
      withoutActivating,
    } = createOrderDto;

    const template = await this.templateService.getById(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }
    if (template.draft)
      throw new BadRequestException('Cant create an order with draft template');

    if (!url.startsWith(template.siteUrl)) {
      throw new BadRequestException(
        'Url for checking doesnt belong to the template site',
      );
    }

    const compareValue = await this.parserService.getDataBySingleSelector(
      url,
      template.selector,
    );

    const payload: Partial<Order> = {
      parseUrl: url,
      template,
      compareValue,
      name,
      notifyPhrase: notifyPhrase || template.notifyPhrase,
      checkInterval,
      checkIntervalUnit,
      user,
      disableAfterTriggering: template.parseType === ParseTypeEnums.list,
    };

    const order = await this.orderRepository.create(payload);
    await order.save();

    const orderHistoryPayload = {
      order,
      title: 'Order created',
      description: `Order starts checking with initial value to compare - "${order.compareValue}"`,
    };
    await this.orderHistoryService.addHistory(orderHistoryPayload);

    if (!withoutActivating) {
      await this.orderCheckerService.addOrderForChecking(order);
    }

    analytic.send('Order created', user.id);

    return order;
  }

  getAllOrderForChecking(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['template', 'user'],
      where: { active: true },
    });
  }
}
