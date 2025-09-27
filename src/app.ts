import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { API_ROUTE_AUTH, API_ROUTE_ATTENDANCE } from '@/routes/routes';
import authRoutes from '@/routes/auth/auth.route';
import attendanceRoutes from '@/routes/attendance/attendance.route';

dotenv.config();

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

app.options('*', cors());

app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API is running' });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(API_ROUTE_AUTH, authRoutes);
app.use(API_ROUTE_ATTENDANCE, attendanceRoutes);

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint does not exist',
  });
});
