import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import *as dotenv from 'dotenv';
import MainRoutes from './app/routes/mainRoutes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
dotenv.config();

const app: Express = express();
app.set('trust proxy', true)

app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', MainRoutes)

app.get('/', (req, res) => {
    res.send('welcome to the server');
});

app.use(globalErrorHandler)

export default app;