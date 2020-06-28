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


const upload = multer(multerConfig);
const routes = new Router();

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.put('/users', authMiddleware, UserController.update);

routes.post('/sessions', SessionController.store);

routes.post('/files', authMiddleware, upload.single('file'), FileController.store);

routes.get('/providers',authMiddleware, ProviderController.index);

routes.get('/appointments',authMiddleware, AppointmentController.index);
routes.post('/appointments',authMiddleware, AppointmentController.store);


routes.post('/appointments',authMiddleware, AppointmentController.store);

routes.get('/schedule',authMiddleware, ScheduleController.index);


export default routes;
