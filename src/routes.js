import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import AuthMiddleware from './app/middlewares/AuthMiddleware';

import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvaiableController from './app/controllers/AvaiableController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.put('/users', AuthMiddleware, UserController.update);
routes.get('/users', UserController.index);

routes.get('/providers', AuthMiddleware, ProviderController.index);
routes.get(
  '/providers/:providerID/avaiable',
  AuthMiddleware,
  AvaiableController.index
);

routes.post('/sessions', SessionController.store);

routes.post('/appointments', AuthMiddleware, AppointmentController.store);
routes.get('/appointments', AuthMiddleware, AppointmentController.index);
routes.delete(
  '/appointments/:id',
  AuthMiddleware,
  AppointmentController.delete
);

routes.get('/schedules', AuthMiddleware, ScheduleController.index);

routes.get('/notifications', AuthMiddleware, NotificationController.index);
routes.put('/notifications/:id', AuthMiddleware, NotificationController.update);

routes.post(
  '/files',
  AuthMiddleware,
  upload.single('file'),
  FileController.store
);

export default routes;
