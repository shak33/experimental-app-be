import cron from 'node-cron';
import { prisma } from '@/db';
import { generateQRCode } from '@/controllers/qrCodes/helpers/generateQRCode.helper';
import { QRCodeStatus } from '@prisma/client';
import { sendMail } from '@/utils/sendMail.util';

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();

    await prisma.qRCode.updateMany({
      where: {
        status: QRCodeStatus.ACTIVE,
        validUntil: { lt: now },
      },
      data: {
        status: QRCodeStatus.EXPIRED,
      },
    });

    const lastQrCode = await prisma.qRCode.findFirst({
      orderBy: {
        validUntil: 'desc',
      },
    });

    if (!lastQrCode || lastQrCode.validUntil < now) {
      const qrCodeImageBuffer = await generateQRCode();

      if (!process.env.EMAIL_ADDRESS_TO_SEND_QR_CODES) {
        console.error('EMAIL_ADDRESS_TO_SEND_QR_CODES is not defined in environment variables.');
        return;
      }

      await sendMail({
        email: process.env.EMAIL_ADDRESS_TO_SEND_QR_CODES,
        subject: 'AMS | This is your new QR Code',
        template: 'qrCodes/new-qr-code.mail.ejs',
        attachments: [
          {
            filename: 'qrcode.png',
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
