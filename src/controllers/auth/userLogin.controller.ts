require('dotenv').config();

import bcrypt from 'bcrypt';
import { Response } from 'express';
import { prisma } from '@/db';
import { createSecretToken } from '@/controllers/auth/utils/createSecretToken.util';
import { ValidatedRequest } from '@/models/ValidatedRequest.type';
import { UserLoginFormData } from './models/userLogin.validation';

export const userLoginController = async (req: ValidatedRequest<UserLoginFormData>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = createSecretToken(user.id);

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        token,
        user: {
          email: user.email,
          firstName: user.firstName,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
