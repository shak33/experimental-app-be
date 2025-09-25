import express from 'express';

import { authRoutes } from '@/routes/routes';

import { requestValidationMiddleware } from '@/middlewares/requestValidation.middleware';

import { userRegistrationController } from '@/controllers/auth/userRegistration.controller';
import { userLoginController } from '@/controllers/auth/userLogin.controller';

import { userRegistrationFormSchema } from '@/controllers/auth/models/userRegistration.validation';
import { userLoginFormSchema } from '@/controllers/auth/models/userLogin.validation';

const router = express.Router();

router.post(
  authRoutes.register,
  requestValidationMiddleware(userRegistrationFormSchema),
  userRegistrationController
);
router.post(
  authRoutes.login,
  requestValidationMiddleware(userLoginFormSchema),
  userLoginController
);

export default router;
