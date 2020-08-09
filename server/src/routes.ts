import express, { response } from 'express';
import db from './database/connection';
import hoursToMinutes from './utils/hoursToMinutes';
import ClassController from './controllers/ClassController';
import ConnectionController from './controllers/ConnectionController';

const routes = express.Router();
const classController = new ClassController();
const connectionController = new ConnectionController();

routes.post('/classes', classController.create);
routes.get('/classes', classController.index);

routes.post('/connections', connectionController.create);
 routes.get('/connections', connectionController.index);

export default routes;
