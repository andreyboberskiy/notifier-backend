export enum NotificationTypeEnum {
  orderTriggered,
  templateNews,
}

export interface NotificationOrderTriggeredData {
  orderId: number;
}
export interface NotificationTemplateNewsData {
  templateId: number;
}
