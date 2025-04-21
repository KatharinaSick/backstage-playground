import { HttpAuthService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { NotificationService } from './services/NotificationService/types';

export async function createRouter({
  notificationService,
}: {
  httpAuth: HttpAuthService;
  notificationService: NotificationService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/', async (_, response) => {
    response
      .json(await notificationService.getNotifications())
      .status(200)
      .end();
  });

  router.post('/', async (req, response) => {
    await notificationService.storeNotification(req.body);
    response.status(201).end();
  });

  return router;
}
