import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as Express from 'express';
import { https } from 'firebase-functions';
import router from './router';

dotenv.config({ path: '../.env' });

const isProduction = process.env['env'] === 'prod';

const app = Express();
if (!isProduction) app.use(cors());

app.use(Express.json());
app.use('/', router);

exports.app = https.onRequest(app);
