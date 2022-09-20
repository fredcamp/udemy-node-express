const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmailEthereal = async (req, res) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "wilton74@ethereal.email",
      pass: "FWv9NF3hmZnFHcBbn5",
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Campo" <fredcampo@example.com',
    to: "bar@email.com",
    subject: "Hello",
    html: "<h2>Send Email from NodeJS</h2>",
  });

  res.json({ info });
};

const sendEmail = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const info = await sgMail.send({
    to: "test@yahoo.com", // Change to your recipient
    from: "test@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  });

  res.json({ info });
};

module.exports = sendEmail;
