import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const body = (await request.json()) as { devisId?: string };
    if (!body?.devisId) {
      return NextResponse.json({ error: "devisId manquant" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const nextInvoiceNumber = async () => {
      const year = new Date().getFullYear();
      const prefix = `FAC-${year}-`;
      const { data } = await supabase
        .from("factures")
        .select("invoice_number")
        .like("invoice_number", `${prefix}%`)
        .order("invoice_number", { ascending: false })
        .limit(1);
      const current = (data?.[0]?.invoice_number as string | undefined) ?? `${prefix}0000`;
      const last = Number(current.split("-").at(-1) ?? "0");
      return `${prefix}${String(last + 1).padStart(4, "0")}`;
    };

    const { data: devis, error: fetchError } = await supabase
      .from("devis")
      .select("*")
      .eq("id", body.devisId)
      .single();

    if (fetchError || !devis) {
      return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
    }

    if (devis.converted_facture_id) {
      return NextResponse.json(
        { error: "Ce devis a déjà été converti en facture." },
        { status: 400 },
      );
    }

    if (!devis.billing_address || !String(devis.billing_address).trim()) {
      return NextResponse.json(
        { error: "Une adresse de facturation est requise avant la conversion." },
        { status: 400 },
      );
    }

    const invoiceNumber = await nextInvoiceNumber();
    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const { data: facture, error: insertError } = await supabase
      .from("factures")
      .insert([
        {
          invoice_number: invoiceNumber,
          company_name: devis.company_name,
          email: devis.email,
          billing_address: devis.billing_address,
          issue_date: issueDate.toISOString().slice(0, 10),
          due_date: dueDate.toISOString().slice(0, 10),
          line_items: devis.line_items,
          notes: devis.notes,
          subtotal: devis.subtotal,
          vat_rate: devis.vat_rate,
          vat_amount: devis.vat_amount,
          total: devis.total,
          status: "draft",
        },
      ])
      .select()
      .single();

    if (insertError || !facture) {
      return NextResponse.json(
        { error: insertError?.message ?? "Échec de la création de la facture" },
        { status: 500 },
      );
    }

    const { error: updateError } = await supabase
      .from("devis")
      .update({ status: "converted", converted_facture_id: facture.id })
      .eq("id", devis.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      factureId: facture.id,
      invoiceNumber: facture.invoice_number,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur interne serveur" },
      { status: 500 },
    );
  }
}
