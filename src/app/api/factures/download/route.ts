import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildDocumentPdf } from "@/lib/pdf/documentPdf";
import { requireAdminSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const factureId = searchParams.get("id");

    if (!factureId) {
      return NextResponse.json({ error: "ID de facture manquant" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: facture, error: fetchError } = await supabase
      .from("factures")
      .select("*")
      .eq("id", factureId)
      .single();

    if (fetchError || !facture) {
      return NextResponse.json({ error: "Facture non trouvée" }, { status: 404 });
    }

    const pdfBuffer = await buildDocumentPdf({
      kind: "FACTURE",
      number: facture.invoice_number,
      companyName: facture.company_name,
      email: facture.email,
      billingAddress: facture.billing_address,
      issueDate: facture.issue_date,
      secondaryDateLabel: "Date d'échéance",
      secondaryDate: facture.due_date,
      lineItems: facture.line_items,
      notes: facture.notes,
    });

    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error("PDF buffer is empty");
      return NextResponse.json({ error: "Erreur de génération PDF" }, { status: 500 });
    }

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${facture.invoice_number}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur interne serveur" },
      { status: 500 }
    );
  }
}
