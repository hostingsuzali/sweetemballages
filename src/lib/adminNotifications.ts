import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpTlsServername = process.env.SMTP_TLS_SERVERNAME;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
const fromEmail =
  process.env.NOTIFICATION_FROM_EMAIL || "Sweet Emballages <contact@sweetemballages.com>";

function canSendEmails() {
  return Boolean(smtpHost && smtpPort && smtpUser && smtpPass && adminEmail);
}

function getTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) return null;

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: smtpTlsServername
      ? {
          servername: smtpTlsServername,
        }
      : undefined,
  });
}

export async function sendAdminContactNotification(input: {
  companyName: string;
  email: string;
  phone: string | null;
  message: string;
}) {
  if (!canSendEmails()) return;

  const transporter = getTransporter();
  if (!transporter || !adminEmail) return;

  const { companyName, email, phone, message } = input;

  await transporter.sendMail({
    from: fromEmail,
    to: adminEmail,
    replyTo: email,
    subject: `Nouveau message contact - ${companyName}`,
    text: [
      "Un nouveau message de contact a ete recu.",
      "",
      `Entreprise: ${companyName}`,
      `Email: ${email}`,
      `Telephone: ${phone ?? "-"}`,
      "",
      "Message:",
      message,
    ].join("\n"),
  });
}

export async function sendAdminQuoteNotification(input: {
  companyName: string;
  email: string;
  phone: string | null;
  message: string;
}) {
  if (!canSendEmails()) return;

  const transporter = getTransporter();
  if (!transporter || !adminEmail) return;

  const { companyName, email, phone, message } = input;

  await transporter.sendMail({
    from: fromEmail,
    to: adminEmail,
    replyTo: email,
    subject: `Nouvelle demande de devis - ${companyName}`,
    text: [
      "Une nouvelle demande de devis a ete recue.",
      "",
      `Entreprise: ${companyName}`,
      `Email: ${email}`,
      `Telephone: ${phone ?? "-"}`,
      "",
      "Details de la demande:",
      message,
    ].join("\n"),
  });
}
