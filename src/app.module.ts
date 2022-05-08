import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from 'config/config';

import { AuthGuard } from 'auth/guards';
import { AuthModule } from 'auth/auth.module';

import { Notification } from 'notification/entity/notification.entity';
import { NotificationModule } from 'notification/notification.module';

import { User } from 'user/entity/user.entity';
import { UserModule } from 'user/user.module';

import { OrderHistory } from 'order-history/entity/order-history.entity';
import { OrderHistoryModule } from 'order-history/order-history.module';

import { Order } from 'order/entity/order.entity';
import { OrderModule } from 'order/order.module';

import { Template } from 'template/entity/template.entity';
import { TemplateModule } from 'template/template.module';

import { ParserModule } from 'parser/parser.module';

import { OrderCheckerModule } from 'order-checker/order-checker.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    TypeOrmModule.forRoot({
      ...config.db,
      entities: [Template, Order, OrderHistory, User, Notification],
    }),
    TemplateModule,
    OrderModule,
    OrderHistoryModule,
    ParserModule,
    AuthModule,
    UserModule,
    OrderCheckerModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
