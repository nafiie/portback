import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const sentFrom = new Sender(process.env.MAIL_FROM_EMAIL, "Nafii Portfolio");

  const recipients = [new Recipient(to, "User")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html || text);

  try {
    await mailerSend.email.send(emailParams);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};
