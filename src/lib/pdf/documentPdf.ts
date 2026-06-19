import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  SWEET_EMBALLAGES_COMPANY,
  computeInvoiceTotals,
  type InvoiceLineItem,
} from "@/lib/invoice";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

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
  const { subtotal, vatAmount, total } = computeInvoiceTotals(input.lineItems);
  const vatRate = subtotal === 0 ? 0 : (vatAmount / subtotal) * 100;

  const tableBody = [
    [
      { text: "Description", bold: true, fillColor: "#f5f5f5" },
      { text: "Qté", bold: true, fillColor: "#f5f5f5", alignment: "right" },
      { text: "Prix unit.", bold: true, fillColor: "#f5f5f5", alignment: "right" },
      { text: "Total", bold: true, fillColor: "#f5f5f5", alignment: "right" },
    ],
    ...input.lineItems.map((item) => [
      item.description,
      { text: String(item.quantity), alignment: "right" },
      { text: formatChf(item.unitPrice), alignment: "right" },
      { text: formatChf(item.quantity * item.unitPrice), alignment: "right" },
    ]),
  ];

  const docDef: any = {
    pageMargins: [50, 50, 50, 50],
    content: [
      {
        columns: [
          {
            text: SWEET_EMBALLAGES_COMPANY.legalName,
            fontSize: 9,
            color: "#666",
            width: "50%",
          },
          {
            stack: [
              { text: SWEET_EMBALLAGES_COMPANY.legalName, alignment: "right", fontSize: 9 },
              { text: SWEET_EMBALLAGES_COMPANY.addressLine1, alignment: "right", fontSize: 9 },
              { text: SWEET_EMBALLAGES_COMPANY.addressLine2, alignment: "right", fontSize: 9 },
              { text: `IDE/UID TVA: ${SWEET_EMBALLAGES_COMPANY.vatNumber}`, alignment: "right", fontSize: 9 },
            ],
            width: "50%",
          },
        ],
        marginBottom: 30,
      },
      {
        text: input.kind,
        fontSize: 24,
        bold: true,
        marginBottom: 10,
      },
      {
        stack: [
          { text: `Numéro: ${input.number}`, fontSize: 10 },
          { text: `Date d'émission: ${formatDate(input.issueDate)}`, fontSize: 10 },
          { text: `${input.secondaryDateLabel}: ${formatDate(input.secondaryDate)}`, fontSize: 10 },
        ],
        marginBottom: 20,
      },
      {
        text: "Client",
        fontSize: 11,
        bold: true,
        marginBottom: 10,
      },
      {
        stack: [
          { text: input.companyName, fontSize: 10 },
          { text: input.email, fontSize: 10 },
          ...(input.billingAddress
            ? input.billingAddress.split("\n").map((line) => ({ text: line, fontSize: 10 }))
            : []),
        ],
        marginBottom: 20,
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", 70, 80, 80],
          body: tableBody,
        },
        marginBottom: 20,
      },
      {
        alignment: "right",
        stack: [
          { text: `Sous-total: ${formatChf(subtotal)}`, fontSize: 10 },
          { text: `TVA (${vatRate.toFixed(1).replace(".", ",")} %): ${formatChf(vatAmount)}`, fontSize: 10 },
          { text: `Total TTC: ${formatChf(total)}`, fontSize: 11, bold: true },
        ],
        marginBottom: input.notes ? 20 : 0,
      },
      ...(input.notes
        ? [
            {
              text: "Notes",
              fontSize: 11,
              bold: true,
              marginBottom: 10,
            },
            {
              text: input.notes,
              fontSize: 10,
            },
          ]
        : []),
    ],
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} / ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      color: "#999",
      margin: [50, 20, 50, 20],
    }),
  };

  return new Promise((resolve, reject) => {
    try {
      const doc = pdfMake.createPdf(docDef);
      const chunks: Buffer[] = [];

      doc.getStream((stream) => {
        stream.on("data", (chunk: Buffer) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", (err: Error) => {
          console.error("PDF generation error:", err);
          reject(err);
        });
      });
    } catch (err) {
      console.error("PDF creation error:", err);
      reject(err);
    }
  });
}
