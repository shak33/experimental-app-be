import { prisma } from '@/db';
import QRCode from 'qrcode';
import crypto from 'crypto';

export const generateQRCode = async () => {
  const secretValue = crypto.randomBytes(32).toString('hex');
  
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);

  await prisma.qRCode.create({
    data: {
      secretValue,
      validUntil,
    },
  });

  const qrCodeImageBuffer = await QRCode.toBuffer(secretValue, { type: 'png' });

  return {
    qrCodeImageBuffer
  }
}