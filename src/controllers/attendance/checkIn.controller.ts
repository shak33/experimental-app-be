import { Response } from 'express';
import { prisma } from '@/db';
import { ValidatedRequest } from '@/models/ValidatedRequest.type';
import { UserCheckInFormData } from './models/checkIn.validation';
import { QRCodeStatus } from '@prisma/client';

export const checkInController = async (
  req: ValidatedRequest<UserCheckInFormData>,
  res: Response,
) => {
  try {
    const { id } = req.user;
    const { scannedValue } = req.body;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingCheckIn = await prisma.attendance.findFirst({
      where: {
        userId: id,
        createdAt: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    });

    if (existingCheckIn?.isValid) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today',
      });
    }

    const qrCode = await prisma.attendanceQRCode.findFirst({
      where: {
        secretValue: scannedValue,
        status: QRCodeStatus.ACTIVE,
        validUntil: {
          gt: new Date(),
        },
      },
    });

    if (!qrCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired QR code',
      });
    }

    await prisma.attendance.create({
      data: {
        userId: id,
        qrCodeId: qrCode.id,
        scannedValue,
        isValid: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Check-in saved successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
