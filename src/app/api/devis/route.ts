import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendAdminQuoteNotification } from "@/lib/adminNotifications";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface RequestedItem {
  productId: string;
  name: string;
  quantity: number;
  unitPriceSnapshot: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, email, phone, message, items } = body as {
      companyName?: string;
      email?: string;
      phone?: string;
      message?: string;
      items?: RequestedItem[];
    };

    if (!companyName || !email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Champs requis manquants : entreprise, email et au moins un produit." },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("demandes_devis").insert([
      {
        company_name: companyName,
        email,
        phone: phone || null,
        message: message || null,
        items,
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
        message: message || null,
        items: items.map((item) => ({ name: item.name, quantity: item.quantity })),
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
