import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { createSecretToken } from '@/controllers/auth/utils/createSecretToken.util';
import { prisma } from '@/db';
import { UserRegistrationFormData } from './models/userRegistration.validation';
import { ValidatedRequest } from '@/models/ValidatedRequest.type';

export const userRegistrationController = async (
  req: ValidatedRequest<UserRegistrationFormData>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
      },
    });

    const token = createSecretToken(newUser.id);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
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
