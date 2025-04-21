import { DiscoveryApi } from '@backstage/core-plugin-api';
import { NotificationsApi } from './api';
import { Notification } from './types';

export interface NotificationsClientOptions {
  discoveryApi: DiscoveryApi;
}

/**
 * An implementation of the NotificationsApi that communicates with the Notifications backend plugin.
 */
export class NotificationsApiClient implements NotificationsApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: NotificationsClientOptions) {
    this.discoveryApi = options.discoveryApi;
  }

  private async fetchFromApi<T>(endpoint: string): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('notifications');
    const targetUrl = `${baseUrl}/${endpoint}`;

    const result = await fetch(targetUrl);
    const data = await result.json();

    if (!result.ok) {
      throw new Error(`Failed to fetch from /${endpoint}: ${data.message}`);
    }
    return data;
  }

  async getNotifications(): Promise<Notification[]> {
    return this.fetchFromApi<Notification[]>('');
  }
}