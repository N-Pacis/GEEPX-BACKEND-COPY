import { createTransport } from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  let transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (ex) {
    return false;
  }
}
