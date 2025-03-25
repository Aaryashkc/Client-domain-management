import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Service from '../models/service.model.js';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendSelfMail = async (serviceData, clientData) => {
  try {
    const recipients = process.env.EMAIL_ADMIN.split(',').map(email => email.trim());
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients, 
      subject: `Service Expiration Reminder:${clientData.companyName}`,
      text: `Hello, 

      The following service is about to expire in 30 days:

      Service Provider: ${serviceData.serviceName}
      Compamy Name: ${clientData.companyName}
      Client Name: ${clientData.clientName}
      Service Type: ${serviceData.serviceType}
      Expiration Date: ${new Date(serviceData.endDate).toLocaleDateString()}

      Please take necessary action.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Reminder email sent to admin');
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

export const startExpirationCheck = () => {
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('Running cron job to check service expirations...');

      const today = new Date();
      const in30Days = new Date(today);
      in30Days.setDate(today.getDate() + 30); 

      const servicesToExpire = await Service.find({
        endDate: {
          $gte: today,
          $lt: in30Days, 
        },
      }).populate('clientId');

      if (servicesToExpire.length === 0) {
        console.log('No services found to expire in 30 days.');
      }

      for (const service of servicesToExpire) {
        const client = service.clientId;
        await sendSelfMail(service, client);
      }
    } catch (error) {
      console.error('Error in expiration check:', error);
    }
  });

  console.log('Expiration check scheduler started');
};


