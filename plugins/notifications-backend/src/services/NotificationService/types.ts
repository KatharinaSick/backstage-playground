export interface Notification {
  message: string;
  channel: string;
  origin: string;
}

export interface NotificationService {
  storeNotification(notification: Notification): Promise<void>;
  getNotifications(): Promise<Notification[]>;
}
