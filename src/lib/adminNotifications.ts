import nodemailer from "nodemailer";
import {
  INVOICE_VAT_RATE,
  SWEET_EMBALLAGES_COMPANY,
  type InvoiceLineItem,
  computeInvoiceTotals,
} from "@/lib/invoice";
import { buildDocumentPdf } from "@/lib/pdf/documentPdf";

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
  message?: string | null;
  items?: { name: string; quantity: number }[];
}) {
  if (!canSendEmails()) return;

  const transporter = getTransporter();
  if (!transporter || !adminEmail) return;

  const { companyName, email, phone, message, items } = input;

  const itemsLines =
    items && items.length > 0
      ? ["Produits demandes:", ...items.map((item) => `- ${item.name} x ${item.quantity}`)]
      : [];

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
      ...itemsLines,
      ...(message ? ["", "Notes complementaires:", message] : []),
    ].join("\n"),
  });
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

  const pdfBytes = await buildDocumentPdf({
    kind: "FACTURE",
    number: input.invoiceNumber,
    companyName: input.companyName,
    email: input.email,
    billingAddress: input.billingAddress,
    issueDate: input.issueDate,
    secondaryDateLabel: "Échéance",
    secondaryDate: input.dueDate,
    lineItems: input.lineItems,
    notes: input.notes,
  });
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

export async function sendQuoteToClient(input: {
  devisNumber: string;
  companyName: string;
  email: string;
  billingAddress?: string | null;
  issueDate: string;
  validUntil: string;
  lineItems: InvoiceLineItem[];
  notes?: string | null;
}) {
  if (!canSendEmails()) return;

  const transporter = getTransporter();
  if (!transporter) return;

  const pdfBytes = await buildDocumentPdf({
    kind: "DEVIS",
    number: input.devisNumber,
    companyName: input.companyName,
    email: input.email,
    billingAddress: input.billingAddress,
    issueDate: input.issueDate,
    secondaryDateLabel: "Validité",
    secondaryDate: input.validUntil,
    lineItems: input.lineItems,
    notes: input.notes,
  });
  const { subtotal, vatAmount, total } = computeInvoiceTotals(input.lineItems);

  await transporter.sendMail({
    from: fromEmail,
    to: input.email,
    subject: `Devis ${input.devisNumber} - ${SWEET_EMBALLAGES_COMPANY.legalName}`,
    text: [
      `Bonjour ${input.companyName},`,
      "",
      `Veuillez trouver en piece jointe votre devis ${input.devisNumber}.`,
      `Sous-total: CHF ${subtotal.toFixed(2)}`,
      `TVA (${(INVOICE_VAT_RATE * 100).toFixed(1).replace(".", ",")} %): CHF ${vatAmount.toFixed(2)}`,
      `Total TTC: CHF ${total.toFixed(2)}`,
      "",
      "Cordialement,",
      SWEET_EMBALLAGES_COMPANY.legalName,
    ].join("\n"),
    attachments: [
      {
        filename: `devis-${input.devisNumber}.pdf`,
        content: pdfBytes,
        contentType: "application/pdf",
      },
    ],
  });
}
