import PDFDocument from "pdfkit";
import path from "path";
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

const PAGE_MARGIN = 50;
const COL_DESCRIPTION_X = PAGE_MARGIN;
const COL_QTY_X = 340;
const COL_UNIT_X = 410;
const COL_TOTAL_X = 490;
const ROW_HEIGHT = 20;

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
  const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const bottomLimit = doc.page.height - doc.page.margins.bottom;

  const drawTableHeader = () => {
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#444");
    doc.text("Description", COL_DESCRIPTION_X, doc.y, { width: COL_QTY_X - COL_DESCRIPTION_X - 10 });
    doc.text("Qté", COL_QTY_X, doc.y - doc.currentLineHeight(), { width: COL_UNIT_X - COL_QTY_X - 10, align: "right" });
    doc.text("Prix unit.", COL_UNIT_X, doc.y - doc.currentLineHeight(), { width: COL_TOTAL_X - COL_UNIT_X - 10, align: "right" });
    doc.text("Total", COL_TOTAL_X, doc.y - doc.currentLineHeight(), { width: doc.page.width - doc.page.margins.right - COL_TOTAL_X, align: "right" });
    doc.moveDown(0.4);
    doc
      .moveTo(PAGE_MARGIN, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor("#ccc")
      .stroke();
    doc.moveDown(0.4);
    doc.font("Helvetica").fillColor("#222");
  };

  const ensureSpace = (needed: number) => {
    if (doc.y + needed > bottomLimit) {
      doc.addPage();
      doc.y = doc.page.margins.top;
      drawTableHeader();
    }
  };

  // Header: logo + company block
  try {
    doc.image(path.join(process.cwd(), "public", "logobrownblack.png"), PAGE_MARGIN, PAGE_MARGIN, {
      width: 110,
    });
  } catch {
    // missing/unreadable logo asset must not block PDF generation
  }

  doc.fontSize(9).fillColor("#444");
  doc.text(SWEET_EMBALLAGES_COMPANY.legalName, 350, PAGE_MARGIN, { align: "right" });
  doc.text(SWEET_EMBALLAGES_COMPANY.addressLine1, { align: "right" });
  doc.text(SWEET_EMBALLAGES_COMPANY.addressLine2, { align: "right" });
  doc.text(`IDE/UID TVA: ${SWEET_EMBALLAGES_COMPANY.vatNumber}`, { align: "right" });

  doc.y = PAGE_MARGIN + 90;
  doc.x = PAGE_MARGIN;

  // Title + numbers
  doc.fillColor("#000").font("Helvetica-Bold").fontSize(22).text(input.kind, PAGE_MARGIN, doc.y);
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(10).fillColor("#333");
  doc.text(`Numéro: ${input.number}`);
  doc.text(`Date d'émission: ${formatDate(input.issueDate)}`);
  doc.text(`${input.secondaryDateLabel}: ${formatDate(input.secondaryDate)}`);

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#000").text("Client");
  doc.font("Helvetica").fontSize(10).fillColor("#333");
  doc.text(input.companyName);
  doc.text(input.email);
  if (input.billingAddress) {
    for (const line of input.billingAddress.split("\n")) {
      doc.text(line);
    }
  }

  doc.moveDown(1.2);
  drawTableHeader();

  for (const item of input.lineItems) {
    ensureSpace(ROW_HEIGHT);
    const lineTotal = item.quantity * item.unitPrice;
    const rowY = doc.y;
    doc.fontSize(9).fillColor("#222");
    doc.text(item.description, COL_DESCRIPTION_X, rowY, { width: COL_QTY_X - COL_DESCRIPTION_X - 10 });
    doc.text(String(item.quantity), COL_QTY_X, rowY, { width: COL_UNIT_X - COL_QTY_X - 10, align: "right" });
    doc.text(formatChf(item.unitPrice), COL_UNIT_X, rowY, { width: COL_TOTAL_X - COL_UNIT_X - 10, align: "right" });
    doc.text(formatChf(lineTotal), COL_TOTAL_X, rowY, {
      width: doc.page.width - doc.page.margins.right - COL_TOTAL_X,
      align: "right",
    });
    doc.y = rowY + ROW_HEIGHT;
  }

  doc.moveDown(0.5);
  doc
    .moveTo(PAGE_MARGIN, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#ccc")
    .stroke();
  doc.moveDown(0.6);

  ensureSpace(ROW_HEIGHT * 3);
  const { subtotal, vatAmount, total } = computeInvoiceTotals(input.lineItems);
  const vatRate = (subtotal === 0 ? 0 : vatAmount / subtotal) * 100;
  doc.font("Helvetica").fontSize(10).fillColor("#222");
  doc.text(`Sous-total: ${formatChf(subtotal)}`, { align: "right" });
  doc.text(`TVA (${vatRate.toFixed(1).replace(".", ",")} %): ${formatChf(vatAmount)}`, { align: "right" });
  doc.font("Helvetica-Bold").text(`Total TTC: ${formatChf(total)}`, { align: "right" });

  if (input.notes) {
    doc.moveDown(1);
    ensureSpace(ROW_HEIGHT * 2);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000").text("Notes");
    doc.font("Helvetica").fontSize(9).fillColor("#333");
    for (const line of input.notes.split("\n")) {
      doc.text(line);
    }
  }

  const pageRange = doc.bufferedPageRange();
  for (let i = 0; i < pageRange.count; i += 1) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor("#999")
      .text(`Page ${i + 1} / ${pageRange.count}`, PAGE_MARGIN, doc.page.height - 30, {
        width: doc.page.width - PAGE_MARGIN * 2,
        align: "center",
      });
  }

  doc.end();
  return done;
}
