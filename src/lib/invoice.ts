export const INVOICE_VAT_RATE = 0.081

export const SWEET_EMBALLAGES_COMPANY = {
  legalName: "Sweet Emballages - Sweetcorp",
  addressLine1: "Route de la Venoge 2",
  addressLine2: "1302 Vufflens-La-Ville",
  vatNumber: "CHE-114.293.151",
} as const

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
}

export function computeInvoiceTotals(lineItems: InvoiceLineItem[]) {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  )
  const vatAmount = subtotal * INVOICE_VAT_RATE
  const total = subtotal + vatAmount

  return {
    subtotal,
    vatAmount,
    total,
  }
}
