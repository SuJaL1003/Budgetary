const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // Replace these with your Mailtrap credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `Budgetary App" <${process.env.MAIL_ID}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

module.exports = sendEmail;
