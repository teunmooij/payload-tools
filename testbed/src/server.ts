import dotenv from 'dotenv';
import express from 'express';
import payload from 'payload';
import initSwagger from 'payload-swagger';

dotenv.config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here
  initSwagger(app, payload.config);

  app.listen(3000);
};

start();
