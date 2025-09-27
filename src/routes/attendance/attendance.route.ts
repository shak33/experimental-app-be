import express from 'express';

import { attendanceRoutes } from '@/routes/routes';

import { checkInController } from '@/controllers/attendance/checkIn.controller';
import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

const router = express.Router();

router.post(attendanceRoutes.checkIn, isAuthenticatedMiddleware, checkInController);
router.get(attendanceRoutes.checkIn, isAuthenticatedMiddleware, checkInController);

export default router;
