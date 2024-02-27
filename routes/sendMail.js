const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});

const fireMail = async ({ senderName, senderMail, bookedFor }) => {
  const info = await transporter.sendMail({
    from: '"Mentorheal Sessions" <sessions@mentorheal.com>',
    replyTo: '"Mentorheal Team" <team@mentorheal.com>',
    to: `"${senderName}" <${senderMail}>,`,
    bcc: '"Mentorheal Team" <team@mentorheal.com>',
    subject: "Confirmation of your session booking with Mentorheal!",
    text: "Hello world?",
    html: `<p>Hello ${senderName},</p>
    <p>We are excited to inform you that your mentorship session has been booked successfully. The session is scheduled for ${bookedFor}. We hope you are looking forward to it as much as we are.</p>
    <p>Our team will reach out to you shortly to confirm and send the session details.</p>
    <p>Thank you for choosing our company for your mentorship needs. We look forward to seeing you soon!</p>
    <p>If you have any questions or need further assistance, please feel free to contact us at <a href="mailto:team@mentorheal.com">team@mentorheal.com</a>.</p>
    <p>Best regards,<br/>The Mentorheal Team</p>`,
  });

  return info;
};

router.post("/send", async (req, res) => {
  const { name, email, bookedOn, bookedFor } = req.body;

  // Check if all required fields are present
  if (!name || !email || !bookedOn || !bookedFor) {
    return res.status(400).send({
      success: false,
      path: req.originalUrl,
      error: "Missing required fields",
    });
  }

  await fireMail({ senderName: name, senderMail: email, bookedFor })
    .then((response) =>
      res.json({ success: true, path: req.originalUrl, data: response })
    )
    .catch((error) =>
      res.json({ success: false, path: req.originalUrl, error: error })
    );
});

module.exports = router;
