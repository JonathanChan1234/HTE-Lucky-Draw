import * as cors from 'cors';
import * as Express from 'express';
import { https } from 'firebase-functions';
import router from './router';

const app = Express();

app.use(
    cors({
        origin: 'https://hte-lucky-draw.web.app',
    })
);
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use('/', router);

exports.app = https.onRequest(app);
