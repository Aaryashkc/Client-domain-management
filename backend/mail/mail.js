import nodemailer from 'nodemailer';
import Service from '../models/service.model.js';
import Email from '../models/email.model.js';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendExpirationEmail = async (service) => {
  try {
    if (!service.emails || service.emails.length === 0) {
      console.log(`No email addresses configured for service: ${service._id}`);
      return;
    }

    const emails = await Email.find({ '_id': { $in: service.emails } });
    const emailAddresses = emails.map(email => email.email);

    if (emailAddresses.length === 0) {
      console.log(`No valid email addresses found for service: ${service._id}`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailAddresses.join(', '),
      subject: `Service Expiration Reminder: ${service.serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Service Expiration Reminder</h2>
          <p>The following service is about to expire in 30 days:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Service Name:</strong> ${service.serviceName}</p>
            <p><strong>Service Provider:</strong> ${service.serviceProviderId?.providerName || 'N/A'}</p>
            <p><strong>Client:</strong> ${service.clientId?.clientName || 'N/A'}</p>
            <p><strong>Service Type:</strong> ${service.serviceType}</p>
            <p><strong>Expiration Date:</strong> ${new Date(service.endDate).toLocaleDateString()}</p>
          </div>
          
          <p>Please take necessary action to renew this service.</p>
          
          <div style="margin-top: 20px; font-size: 12px; color: #888;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Expiration email sent for service ${service._id} to: ${emailAddresses.join(', ')}`);
    await Service.findByIdAndUpdate(service._id, {
      lastEmailSent: new Date()
    });
    
  } catch (error) {
    console.error(`Error sending expiration email for service ${service._id}:`, error);
  }
};

const calculateDaysRemaining = (endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};


//here i have set the daily expiration check
export const startExpirationCheck = () => {
  cron.schedule('45 13 * * *', async () => {
    console.log('Running daily service expiration check...');
    
    try {

      const services = await Service.find()
        .populate('clientId', 'clientName')
        .populate('serviceProviderId', 'providerName');
      
      let emailsSent = 0;
      
      for (const service of services) {
        const daysRemaining = calculateDaysRemaining(service.endDate);

        if (daysRemaining === 30) {
          await sendExpirationEmail(service);
          emailsSent++;
        }
      }
      
      console.log(`Expiration check completed. Sent ${emailsSent} notification emails.`);
    } catch (error) {
      console.error('Error during scheduled expiration check:', error);
    }
  });

  console.log('Service expiration check scheduler initialized');
};

export const sendManualExpirationEmail = async (serviceId) => {
  try {
    const service = await Service.findById(serviceId)
      .populate('clientId', 'clientName')
      .populate('serviceProviderId', 'providerName');
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    await sendExpirationEmail(service);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending manual expiration email:', error);
    throw error;
  }
};