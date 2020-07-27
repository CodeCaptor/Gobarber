import { Router } from 'express';

import multer from 'multer';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
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

import UserValidator from './app/validators/UserValidator';
import SessionValidator from './app/validators/SessionValidator';
import AppointmentValidator from './app/validators/AppointmentValidator';

import BruteRedisConfig from './config/bruteRedis';

const routes = Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis(BruteRedisConfig);
const bruteForce = new Brute(bruteStore);

routes.post('/users', UserValidator.store, UserController.store);
routes.put(
  '/users',
  AuthMiddleware,
  UserValidator.update,
  UserController.update
);
routes.get('/users', UserController.index);

routes.get('/providers', AuthMiddleware, ProviderController.index);
routes.get(
  '/providers/:providerID/avaiable',
  AuthMiddleware,
  AvaiableController.index
);

routes.post(
  '/sessions',
  bruteForce.prevent,
  SessionValidator.store,
  SessionController.store
);

routes.post(
  '/appointments',
  AuthMiddleware,
  AppointmentValidator.store,
  AppointmentController.store
);
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
