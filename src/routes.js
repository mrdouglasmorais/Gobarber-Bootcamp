import { Router } from 'express';

import UserController from './app/controllers/UsersControllers';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const route = new Router();

route.post('/users', UserController.store);
route.post('/sessions', SessionController.store);

route.use(authMiddleware);
// Middleware global em nossa aplicação.

route.put('/users', UserController.update);

export default route;
