

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rayen.ben.mansour@gmail.com",
    pass: "kuqc rhcu kfww ailq", // Use App Password from Google Account
  },
});

const sendmail= async (req, res) => {
    const { name, email, message } = req.body;
  
    const mailOptions = {
      from: email,
      to: 'savoirdevenir66@gmail.com',
      subject: `New message from ${name}`,
      text: message,
      html: `<p>From: ${name} (${email})</p><p>${message}</p>`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    }
  }
  module.exports={sendmail}