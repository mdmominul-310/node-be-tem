import express, { Express, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors, { CorsOptions } from 'cors';
import *as dotenv from 'dotenv';
import MainRoutes from './app/routes/mainRoutes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import helmet from 'helmet';
import logger from 'morgan'
dotenv.config();

const app: Express = express();
app.set('trust proxy', true)

const logTime = () => {
    const time = new Date();
    return time.toString().slice(0, 24);
};
const corsOptions: CorsOptions = {
    origin: true,
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization'],
    // methods: '*',
};
const options: RequestHandler[] = [
    cors(corsOptions),
    cookieParser(),
    helmet(),
    logger(function (tokens, req, res) {
        return [
            tokens.method(req, res)?.blue,
            tokens.url(req, res)?.cyan,
            Number(tokens.status(req, res)) === 200 ? tokens.status(req, res)?.green : tokens.status(req, res)?.red ?? '',
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            '/',
            logTime(),
        ].join(' ');
    }),
    express.json({ limit: '50mb' }),
    express.urlencoded({ extended: true }),
];


app.use(...options);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', MainRoutes)

app.get('/', (req, res) => {
    res.send('welcome to the server');
});

app.use(globalErrorHandler)

export default app;