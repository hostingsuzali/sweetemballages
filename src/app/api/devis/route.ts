import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendAdminQuoteNotification } from "@/lib/adminNotifications";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, email, phone, message } = body;

    if (!companyName || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("demandes_devis").insert([
      {
        company_name: companyName,
        email,
        phone: phone || null,
        message,
        is_read: false,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      await sendAdminQuoteNotification({
        companyName,
        email,
        phone: phone || null,
        message,
      });
    } catch (mailError) {
      console.error("Devis email notification error:", mailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Devis API error:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
