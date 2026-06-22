import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import {
  SWEET_EMBALLAGES_COMPANY,
  computeInvoiceTotals,
  type InvoiceLineItem,
} from "@/lib/invoice";

export interface PdfDocumentInput {
  kind: "DEVIS" | "FACTURE";
  number: string;
  companyName: string;
  email: string;
  billingAddress?: string | null;
  issueDate: string;
  secondaryDateLabel: string;
  secondaryDate: string;
  lineItems: InvoiceLineItem[];
  notes?: string | null;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatChf(value: number) {
  return `CHF ${value.toFixed(2)}`;
}

export async function buildDocumentPdf(input: PdfDocumentInput): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  const margin = 50;
  let yPosition = height - margin;

  const { subtotal, vatAmount, total } = computeInvoiceTotals(input.lineItems);
  const vatRate = subtotal === 0 ? 0 : (vatAmount / subtotal) * 100;

  // Helper to add text
  const addText = (text: string, x: number, y: number, size: number = 10, bold = false) => {
    page.drawText(text, {
      x,
      y,
      size,
      color: rgb(0, 0, 0),
    });
  };

  // Header - Company info (right aligned)
  addText(SWEET_EMBALLAGES_COMPANY.legalName, width - margin - 200, yPosition, 9);
  yPosition -= 12;
  addText(SWEET_EMBALLAGES_COMPANY.addressLine1, width - margin - 200, yPosition, 9);
  yPosition -= 12;
  addText(SWEET_EMBALLAGES_COMPANY.addressLine2, width - margin - 200, yPosition, 9);
  yPosition -= 12;
  addText(`IDE/UID TVA: ${SWEET_EMBALLAGES_COMPANY.vatNumber}`, width - margin - 200, yPosition, 9);
  yPosition -= 30;

  // Title
  addText(input.kind, margin, yPosition, 22);
  yPosition -= 30;

  // Invoice details
  addText(`Numéro: ${input.number}`, margin, yPosition, 10);
  yPosition -= 15;
  addText(`Date d'émission: ${formatDate(input.issueDate)}`, margin, yPosition, 10);
  yPosition -= 15;
  addText(`${input.secondaryDateLabel}: ${formatDate(input.secondaryDate)}`, margin, yPosition, 10);
  yPosition -= 25;

  // Client section
  addText("Client", margin, yPosition, 11);
  yPosition -= 15;
  addText(input.companyName, margin, yPosition, 10);
  yPosition -= 12;
  addText(input.email, margin, yPosition, 10);
  yPosition -= 12;

  if (input.billingAddress) {
    for (const line of input.billingAddress.split("\n")) {
      addText(line, margin, yPosition, 10);
      yPosition -= 12;
    }
  }

  yPosition -= 15;

  // Table header
  const colX = [margin, 340, 410, 490];
  const colLabels = ["Description", "Qté", "Prix unit.", "Total"];
  page.drawRectangle({
    x: margin,
    y: yPosition - 15,
    width: width - margin * 2,
    height: 15,
    color: rgb(0.96, 0.96, 0.96),
  });
  for (let i = 0; i < colLabels.length; i++) {
    addText(colLabels[i], colX[i], yPosition - 12, 9);
  }
  yPosition -= 20;

  // Table rows
  for (const item of input.lineItems) {
    const lineTotal = item.quantity * item.unitPrice;
    const texts = [
      item.description,
      String(item.quantity),
      formatChf(item.unitPrice),
      formatChf(lineTotal),
    ];

    // Check if we need a new page
    if (yPosition < margin + 60) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - margin;
      // Redraw table header
      page.drawRectangle({
        x: margin,
        y: yPosition - 15,
        width: width - margin * 2,
        height: 15,
        color: rgb(0.96, 0.96, 0.96),
      });
      for (let i = 0; i < colLabels.length; i++) {
        addText(colLabels[i], colX[i], yPosition - 12, 9);
      }
      yPosition -= 20;
    }

    for (let i = 0; i < texts.length; i++) {
      const alignment = i === 0 ? margin : colX[i];
      addText(texts[i], alignment, yPosition, 9);
    }
    yPosition -= 15;
  }

  yPosition -= 15;

  // Totals
  addText(`Sous-total: ${formatChf(subtotal)}`, width - margin - 150, yPosition, 10);
  yPosition -= 15;
  addText(
    `TVA (${vatRate.toFixed(1).replace(".", ",")} %): ${formatChf(vatAmount)}`,
    width - margin - 150,
    yPosition,
    10
  );
  yPosition -= 15;
  addText(`Total TTC: ${formatChf(total)}`, width - margin - 150, yPosition, 10);

  // Notes
  if (input.notes) {
    yPosition -= 25;
    addText("Notes", margin, yPosition, 11);
    yPosition -= 15;
    for (const line of input.notes.split("\n")) {
      addText(line, margin, yPosition, 9);
      yPosition -= 12;
    }
  }

  // Save and return buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
