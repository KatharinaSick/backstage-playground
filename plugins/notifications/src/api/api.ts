import { createApiRef } from '@backstage/core-plugin-api';
import { Notification } from './types';

export interface NotificationsApi {
  /**
   * Gets all notifications
   */
  getNotifications(): Promise<Notification[]>;
}

/**
 * ApiRef for the PrivacyInsightsApi.
 */
export const notificationsApiRef = createApiRef<NotificationsApi>({
  id: 'plugin.notifications.api',
});