import nodemailer from 'nodemailer';
import Service from '../models/service.model.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendServiceEmail = async (req, res) => {
  const serviceId = req.params.id;

  try {
    const service = await Service.findById(serviceId).populate('clientId', 'clientEmail clientName');
    
    if (!service) {
      return res.status(404).send({ message: 'Service not found' });
    }

    const clientEmail = service.clientId.clientEmail;
    const clientName = service.clientId.clientName;

    const mailOptions = {
      from: process.env.EMAIL_USER,  
      to: clientEmail,  
      subject: `Service Update for ${clientName}`,
      text: `Dear ${clientName},\n\nWe are writing to update you regarding your service: ${service.serviceName} which will be expire soon on ${service.endDate}\n\n please contact us for more details.\n\nBest Regards,\nSoftech Foundation`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Email sent successfully to ' + clientName });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Failed to send email' });
  }
};