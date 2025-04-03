import { LoggerService } from '@backstage/backend-plugin-api';
import { Notification, NotificationService } from './types';
import { Knex } from 'knex';

export async function createNotificationService({
  logger,
  db,
}: {
  logger: LoggerService;
  db: Knex;
}): Promise<NotificationService> {
  logger.info('Creating NotificationService');

  return {
    async storeNotification(notification: Notification): Promise<void> {
      await db('notifications').insert({
        message: notification.message,
        channel: notification.channel,
        origin: notification.origin,
      });
    },

    async getNotifications(): Promise<Notification[]> {
      return db('notifications');
    },
  };
}
