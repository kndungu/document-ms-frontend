import express from 'express';

import config from './config';

const app = express();

// Connect to the database
config.db();

// Setup passport strategies
config.passport();

// Add middleware to express
config.express(app);

// Start taking requests
const webServer = app.listen(process.env.PORT, (error) => {
  // Can't think of a way to test server error
  /* istanbul ignore next */
  if (error) {
    console.log(error);
  } else {
    console.info('Server listening at port', process.env.PORT);
  }
});

// To be able to use with supertest
module.exports = webServer;

