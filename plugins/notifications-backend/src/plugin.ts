import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { createNotificationService } from './services/NotificationService';
import { resolvePackagePath } from '@backstage/backend-plugin-api';

/**
 * notificationsPlugin backend plugin
 *
 * @public
 */
export const notificationsPlugin = createBackendPlugin({
  pluginId: 'notifications',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        database: coreServices.database,
      },
      async init({ logger, httpAuth, httpRouter, database }) {
        const dbClient = await database.getClient();
        const dbMigrationsDir = resolvePackagePath(
            '@internal/plugin-notifications-backend',
            'migrations',
        );
        if (!database.migrations?.skip) {
          await dbClient.migrate.latest({
            directory: dbMigrationsDir,
          });
        }

        const notificationService = await createNotificationService({logger, db: dbClient});

        httpRouter.use(
          await createRouter({
            httpAuth,
            notificationService,
          }),
        );

        // allow unauthenticated requests
        httpRouter.addAuthPolicy({
          path: '*',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
