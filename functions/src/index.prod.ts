import * as cors from 'cors';
import * as Express from 'express';
import { https } from 'firebase-functions';
import router from './router';

const app = Express();

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use('/', router);

exports.app = https.onRequest(app);
