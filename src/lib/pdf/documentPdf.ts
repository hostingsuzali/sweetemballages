import { PDFDocument, rgb } from "pdf-lib";
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

const COLORS = {
  dark: rgb(0.15, 0.15, 0.15),
  gray: rgb(0.4, 0.4, 0.4),
  lightGray: rgb(0.95, 0.95, 0.95),
  border: rgb(0.85, 0.85, 0.85),
  kraft: rgb(0.68, 0.57, 0.4), // kraft brown color
};

export async function buildDocumentPdf(input: PdfDocumentInput): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const margin = 40;
  let yPosition = height - margin;

  const { subtotal, vatAmount, total } = computeInvoiceTotals(input.lineItems);
  const vatRate = subtotal === 0 ? 0 : (vatAmount / subtotal) * 100;

  // Helper functions
  const drawText = (text: string, x: number, y: number, size = 10, color = COLORS.dark, bold = false) => {
    page.drawText(text, { x, y, size, color });
  };

  const drawLine = (x1: number, y: number, x2: number, color = COLORS.border, thickness = 1) => {
    page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness,
      color,
    });
  };

  const drawRect = (x: number, y: number, w: number, h: number, color = COLORS.lightGray) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color,
      borderColor: COLORS.border,
      borderWidth: 0.5,
    });
  };

  // Header section
  drawText(SWEET_EMBALLAGES_COMPANY.legalName, margin, yPosition, 11, COLORS.kraft, true);
  yPosition -= 14;
  drawText(SWEET_EMBALLAGES_COMPANY.addressLine1, margin, yPosition, 8, COLORS.gray);
  yPosition -= 11;
  drawText(SWEET_EMBALLAGES_COMPANY.addressLine2, margin, yPosition, 8, COLORS.gray);
  yPosition -= 11;
  drawText(`IDE/UID TVA: ${SWEET_EMBALLAGES_COMPANY.vatNumber}`, margin, yPosition, 8, COLORS.gray);
  yPosition -= 30;

  // Document title
  drawText(input.kind, margin, yPosition, 26, COLORS.dark, true);
  yPosition -= 32;

  // Document details (left) and dates (right)
  const detailsX = margin;
  const datesX = width - margin - 180;

  drawText("Numéro", detailsX, yPosition, 8, COLORS.gray);
  drawText(input.number, detailsX, yPosition - 14, 11, COLORS.dark, true);

  drawText("Date d'émission", datesX, yPosition, 8, COLORS.gray);
  drawText(formatDate(input.issueDate), datesX, yPosition - 14, 10, COLORS.dark);

  yPosition -= 30;

  drawText("Date d'échéance", datesX, yPosition, 8, COLORS.gray);
  drawText(formatDate(input.secondaryDate), datesX, yPosition - 14, 10, COLORS.dark);

  yPosition -= 35;

  // Client section with background
  drawRect(margin, yPosition - 70, width - margin * 2, 70);
  drawText("FACTURÉ À", margin + 10, yPosition - 15, 9, COLORS.gray);
  drawText(input.companyName, margin + 10, yPosition - 30, 11, COLORS.dark, true);
  drawText(input.email, margin + 10, yPosition - 44, 9, COLORS.dark);

  let clientY = yPosition - 58;
  if (input.billingAddress) {
    for (const line of input.billingAddress.split("\n").slice(0, 2)) {
      drawText(line, margin + 10, clientY, 9, COLORS.dark);
      clientY -= 12;
    }
  }

  yPosition -= 85;

  // Table headers with background
  const colX = [margin + 5, 340, 420, 490];
  const colLabels = ["Description", "Qté", "Prix unit.", "Total"];

  // Draw header background
  drawRect(margin, yPosition - 20, width - margin * 2, 20, COLORS.lightGray);

  // Draw header text
  drawText(colLabels[0], colX[0], yPosition - 16, 9, COLORS.gray, true);
  drawText(colLabels[1], colX[1], yPosition - 16, 9, COLORS.gray, true);
  drawText(colLabels[2], colX[2], yPosition - 16, 9, COLORS.gray, true);
  drawText(colLabels[3], colX[3] + 30, yPosition - 16, 9, COLORS.gray, true);

  yPosition -= 25;

  // Draw separator line
  drawLine(margin, yPosition, width - margin, COLORS.border, 1);
  yPosition -= 10;

  // Table rows
  const rowHeight = 18;
  let rowIndex = 0;
  for (const item of input.lineItems) {
    const lineTotal = item.quantity * item.unitPrice;

    // Check if we need a new page
    if (yPosition < margin + 120) {
      // Add page number to current page
      drawText(`Page 1`, width / 2 - 10, margin - 30, 8, COLORS.gray);

      page = pdfDoc.addPage([595, 842]);
      yPosition = height - margin;

      // Redraw table headers on new page
      drawRect(margin, yPosition - 20, width - margin * 2, 20, COLORS.lightGray);
      for (let i = 0; i < colLabels.length; i++) {
        const isLast = i === colLabels.length - 1;
        drawText(colLabels[i], colX[i] + (isLast ? colWidths[i] - 70 : 5), yPosition - 16, 9, COLORS.gray, true);
      }
      yPosition -= 25;
      drawLine(margin, yPosition, width - margin, COLORS.border, 1);
      yPosition -= 10;
    }

    // Alternate row background
    if (rowIndex % 2 === 0) {
      page.drawRectangle({
        x: margin,
        y: yPosition - rowHeight,
        width: width - margin * 2,
        height: rowHeight,
        color: rgb(0.99, 0.99, 0.99),
      });
    }

    // Row content
    drawText(item.description, colX[0], yPosition - 12, 9, COLORS.dark);
    drawText(String(item.quantity), colX[1] + 15, yPosition - 12, 9, COLORS.dark);
    drawText(formatChf(item.unitPrice), colX[2] + 5, yPosition - 12, 9, COLORS.dark);
    drawText(formatChf(lineTotal), colX[3] + 35, yPosition - 12, 9, COLORS.dark, true);

    yPosition -= rowHeight;
    rowIndex++;
  }

  // Final separator line
  drawLine(margin, yPosition, width - margin, COLORS.border, 1);
  yPosition -= 18;

  // Totals section (right aligned)
  const totalLabelX = width - 240;
  const totalValueX = width - margin - 50;

  drawText("Sous-total", totalLabelX, yPosition, 9, COLORS.gray);
  drawText(formatChf(subtotal), totalValueX, yPosition, 9, COLORS.dark);
  yPosition -= 16;

  drawText(`TVA (${vatRate.toFixed(1).replace(".", ",")} %)`, totalLabelX, yPosition, 9, COLORS.gray);
  drawText(formatChf(vatAmount), totalValueX, yPosition, 9, COLORS.dark);
  yPosition -= 22;

  // Total with background box
  drawRect(totalLabelX - 15, yPosition - 18, 225, 18, COLORS.kraft);
  drawText("TOTAL TTC", totalLabelX, yPosition - 14, 9, rgb(1, 1, 1), true);
  drawText(formatChf(total), totalValueX, yPosition - 14, 11, rgb(1, 1, 1), true);

  yPosition -= 40;

  // Notes section
  if (input.notes) {
    drawText("NOTES", margin, yPosition, 9, COLORS.gray, true);
    yPosition -= 14;
    for (const line of input.notes.split("\n")) {
      drawText(line, margin, yPosition, 9, COLORS.dark);
      yPosition -= 12;
    }
  }

  // Footer
  drawText(`Page 1 of 1`, width / 2 - 20, margin - 30, 8, COLORS.gray);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
