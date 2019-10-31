import express from 'express';
import route from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    // A baixo os middlewares.
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(route);
  }
}

export default new App().server;
