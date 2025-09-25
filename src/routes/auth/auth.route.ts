import express from 'express';

import { authRoutes } from '@/routes/routes';

import { requestValidationMiddleware } from '@/middlewares/requestValidation.middleware';

import { userRegistrationController } from '@/controllers/auth/userRegistration.controller';

import { userRegistrationFormSchema } from '@/controllers/auth/models/userRegistration.validation';

const router = express.Router();

router.post(
  authRoutes.register,
  requestValidationMiddleware(userRegistrationFormSchema),
  userRegistrationController
);

export default router;
