require('dotenv').config();
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: {
    [key: string]: string | number | object;
  };
}

export const sendMail = async (options: EmailOptions): Promise<void> => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    return Promise.reject(new Error('SMTP configuration is missing in environment variables'));
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;
  const templatePath = path.join(__dirname, '../mails', template);
  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: `${process.env.SMTP_NAME} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return Promise.reject(error);
  }
};
