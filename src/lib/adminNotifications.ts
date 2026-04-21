import nodemailer from "nodemailer";
import {
  INVOICE_VAT_RATE,
  SWEET_EMBALLAGES_COMPANY,
  type InvoiceLineItem,
  computeInvoiceTotals,
} from "@/lib/invoice";

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

async function buildInvoicePdf(input: {
  invoiceNumber: string;
  companyName: string;
  email: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  notes?: string | null;
}) {
  const { subtotal, vatAmount, total } = computeInvoiceTotals(input.lineItems);
  const lines = [
    "FACTURE",
    SWEET_EMBALLAGES_COMPANY.legalName,
    SWEET_EMBALLAGES_COMPANY.addressLine1,
    SWEET_EMBALLAGES_COMPANY.addressLine2,
    `IDE/UID TVA: ${SWEET_EMBALLAGES_COMPANY.vatNumber}`,
    "",
    `Numero: ${input.invoiceNumber}`,
    `Date facture: ${input.issueDate}`,
    `Echeance: ${input.dueDate}`,
    "",
    `Client: ${input.companyName}`,
    `Email: ${input.email}`,
    "Adresse de facturation:",
    ...input.billingAddress.split("\n"),
    "",
    "Lignes:",
    ...input.lineItems.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      return `- ${item.description} | Qt: ${item.quantity} | Prix: CHF ${item.unitPrice.toFixed(2)} | Total: CHF ${lineTotal.toFixed(2)}`;
    }),
    "",
    `Sous-total: CHF ${subtotal.toFixed(2)}`,
    `TVA (${(INVOICE_VAT_RATE * 100).toFixed(1).replace(".", ",")} %): CHF ${vatAmount.toFixed(2)}`,
    `Total TTC: CHF ${total.toFixed(2)}`,
  ];

  if (input.notes) {
    lines.push("", "Notes:", ...input.notes.split("\n"));
  }

  const escapePdfText = (value: string) =>
    value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

  const content = lines
    .map((line, index) => {
      const y = 800 - index * 16;
      return `BT /F1 11 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");

  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj ${stream} endobj`,
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(body.length);
    body += `${obj}\n`;
  });

  const xrefStart = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    body += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(body, "utf-8");
}

export async function sendInvoiceToClient(input: {
  invoiceNumber: string;
  companyName: string;
  email: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  notes?: string | null;
}) {
  if (!canSendEmails()) return;

  const transporter = getTransporter();
  if (!transporter) return;

  const pdfBytes = await buildInvoicePdf(input);
  const { subtotal, vatAmount, total } = computeInvoiceTotals(input.lineItems);

  await transporter.sendMail({
    from: fromEmail,
    to: input.email,
    subject: `Facture ${input.invoiceNumber} - ${SWEET_EMBALLAGES_COMPANY.legalName}`,
    text: [
      `Bonjour ${input.companyName},`,
      "",
      `Veuillez trouver en piece jointe votre facture ${input.invoiceNumber}.`,
      `Sous-total: CHF ${subtotal.toFixed(2)}`,
      `TVA (${(INVOICE_VAT_RATE * 100).toFixed(1).replace(".", ",")} %): CHF ${vatAmount.toFixed(2)}`,
      `Total TTC: CHF ${total.toFixed(2)}`,
      "",
      "Cordialement,",
      SWEET_EMBALLAGES_COMPANY.legalName,
    ].join("\n"),
    attachments: [
      {
        filename: `facture-${input.invoiceNumber}.pdf`,
        content: pdfBytes,
        contentType: "application/pdf",
      },
    ],
  });
}
