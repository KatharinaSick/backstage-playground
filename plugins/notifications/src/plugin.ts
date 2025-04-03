import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { NotificationsApiClient, notificationsApiRef } from './api';

export const notificationsPlugin = createPlugin({
  id: 'notifications',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: notificationsApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) =>
        new NotificationsApiClient({ discoveryApi }),
    }),
  ],
});

export const NotificationsPage = notificationsPlugin.provide(
  createRoutableExtension({
    name: 'NotificationsPage',
    component: () =>
      import('./components/NotificationPageComponent').then(
        m => m.NotificationPageComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);
