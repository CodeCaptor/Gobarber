import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';

const routes = Router();

routes.post('/users', UserController.store);
routes.put('/users', AuthMiddleware, UserController.update);
routes.get('/users', UserController.index);

routes.post('/sessions', SessionController.store);

export default routes;
