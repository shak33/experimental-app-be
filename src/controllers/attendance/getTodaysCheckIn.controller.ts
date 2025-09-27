import { Request, Response } from 'express';
import { prisma } from '@/db';

export const getTodaysCheckInController = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayCheckIn = await prisma.attendance.findFirst({
      where: {
        userId: id,
        createdAt: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    });

    if (!todayCheckIn) {
      return res.status(404).json({
        success: false,
        message: 'No check-in found for today',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
