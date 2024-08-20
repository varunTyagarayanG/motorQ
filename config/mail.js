const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('en-US', options).replace(',', '');
};

const mailServices = async (email, subject, carDetails, additionalInfo,) => {
  const formattedFrom = formatDate(additionalInfo.from);
  const formattedTo = formatDate(additionalInfo.to);

  const text = `
    Dear User,

    Your booking for the car has been confirmed.

    Car Details:
    Name: ${carDetails.carname}
    Size: ${carDetails.carsize}
    Fuel Type: ${carDetails.carFuel}
    Registration Number: ${carDetails.registrationNumber}

    Booking Period:
    From: ${formattedFrom}
    To: ${formattedTo}

    Thank you for booking with us!

    Best regards,
    Your Car Rental Service
  `;

  const html = `
    <p>Dear User,</p>
    <p>Your booking for the car has been confirmed.</p>
    <h3>Car Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${carDetails.carname}</li>
      <li><strong>Size:</strong> ${carDetails.carsize}</li>
      <li><strong>Fuel Type:</strong> ${carDetails.carFuel}</li>
      <li><strong>Registration Number:</strong> ${carDetails.registrationNumber}</li>
    </ul>
    <h3>Booking Period:</h3>
    <ul>
      <li><strong>From:</strong> ${formattedFrom}</li>
      <li><strong>To:</strong> ${formattedTo}</li>
    </ul>
    <p>Thank you for booking with us!</p>
    <p>Best regards,<br>Your Car Rental Service</p>
  `;

  await sendEmail(email, subject, text, html);
};

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });
    
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = mailServices;
