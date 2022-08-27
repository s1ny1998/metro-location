'use strict';

const errorHandlingMiddleware = require('../lib/error-handling-middleware');
// const usersRouter = require('./users');
// const authRouter = require('./auth');
const locationRouter = require('./location');

module.exports = (app) => {
  app.use('/api/v1/location', locationRouter);
  // app.use('/api/v1/docs', apiDocsRouter);
  app.use(errorHandlingMiddleware);
};
