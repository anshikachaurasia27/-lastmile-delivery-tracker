const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function sendStatusEmail(toEmail, orderId, status) {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: toEmail,
    subject: `Order #${orderId} Update - ${status}`,
    text: `Your order status has been updated to: ${status}`
  });
}

module.exports = { sendStatusEmail };