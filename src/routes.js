import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';
import ProviderController from './app/controllers/ProviderController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.put('/users', AuthMiddleware, UserController.update);
routes.get('/users', UserController.index);
routes.get('/providers', AuthMiddleware, ProviderController.index);

routes.post('/sessions', SessionController.store);

routes.post(
  '/files',
  AuthMiddleware,
  upload.single('file'),
  FileController.store
);

export default routes;
