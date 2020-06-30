import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth'
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvaiableController from './app/controllers/AvaiableController';


const upload = multer(multerConfig);
const routes = new Router();

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.put('/users', authMiddleware, UserController.update);

routes.post('/sessions', SessionController.store);

routes.post('/files', authMiddleware, upload.single('file'), FileController.store);

routes.get('/providers',authMiddleware, ProviderController.index);
routes.get('/providers/:providerID/avaiable',authMiddleware, AvaiableController.index);


routes.get('/appointments',authMiddleware, AppointmentController.index);
routes.post('/appointments',authMiddleware, AppointmentController.store);
routes.delete('/appointments/:id',authMiddleware, AppointmentController.delete);


routes.post('/appointments',authMiddleware, AppointmentController.store);

routes.get('/schedule',authMiddleware, ScheduleController.index);

routes.get('/notifications',authMiddleware, NotificationController.index);
routes.put('/notifications/:id',authMiddleware, NotificationController.update);


export default routes;
