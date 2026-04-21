import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInvoiceToClient } from "@/lib/adminNotifications";
import { computeInvoiceTotals, INVOICE_VAT_RATE } from "@/lib/invoice";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface InvoicePayload {
  id: string;
  invoiceNumber: string;
  companyName: string;
  email: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  lineItems: { description: string; quantity: number; unitPrice: number }[];
  notes?: string | null;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as InvoicePayload;
    if (
      !payload?.id ||
      !payload.invoiceNumber ||
      !payload.companyName ||
      !payload.email ||
      !payload.billingAddress ||
      !payload.issueDate ||
      !payload.dueDate ||
      !Array.isArray(payload.lineItems) ||
      payload.lineItems.length === 0
    ) {
      return NextResponse.json({ error: "Données de facture invalides" }, { status: 400 });
    }

    const { subtotal, vatAmount, total } = computeInvoiceTotals(payload.lineItems);
    await sendInvoiceToClient(payload);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase
      .from("factures")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        subtotal,
        vat_rate: INVOICE_VAT_RATE,
        vat_amount: vatAmount,
        total,
      })
      .eq("id", payload.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur interne serveur" },
      { status: 500 },
    );
  }
}
