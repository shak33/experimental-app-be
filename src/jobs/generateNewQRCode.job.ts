import cron from 'node-cron';
import { prisma } from '@/db';
import { generateQRCode } from '@/controllers/qrCodes/helpers/generateQRCode.helper';
import { QRCodeStatus } from '@prisma/client';
import { sendMail } from '@/utils/sendMail.util';

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();

    await prisma.attendanceQRCode.updateMany({
      where: {
        status: QRCodeStatus.ACTIVE,
        validUntil: { lt: now },
      },
      data: {
        status: QRCodeStatus.EXPIRED,
      },
    });

    const lastAttendanceQRCode = await prisma.attendanceQRCode.findFirst({
      orderBy: {
        validUntil: 'desc',
      },
    });

    if (!lastAttendanceQRCode || lastAttendanceQRCode.validUntil < now) {
      const qrCodeImageBuffer = await generateQRCode();

      if (!process.env.EMAIL_ADDRESS_TO_SEND_QR_CODES) {
        console.error('EMAIL_ADDRESS_TO_SEND_QR_CODES is not defined in environment variables.');
        return;
      }

      await sendMail({
        email: process.env.EMAIL_ADDRESS_TO_SEND_QR_CODES,
        subject: 'AMS | This is your new Attendance QR Code',
        template: 'qrCodes/new-attendance-qr-code.mail.ejs',
        attachments: [
          {
            filename: 'attendance-qrcode.png',
            content: qrCodeImageBuffer,
            contentType: 'image/png',
          },
        ],
      });
    }
  } catch (error) {
    console.error('Error in cron job generating new QR Code:', error);
  }
});
