"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  computeInvoiceTotals,
  INVOICE_VAT_RATE,
  SWEET_EMBALLAGES_COMPANY,
  type InvoiceLineItem,
} from "@/lib/invoice";
import { FileText, Mail, Plus, Trash2 } from "lucide-react";

interface FactureRow {
  id: string;
  invoice_number: string;
  company_name: string;
  email: string;
  billing_address: string;
  issue_date: string;
  due_date: string;
  line_items: InvoiceLineItem[];
  notes: string | null;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  status: string;
  sent_at: string | null;
  created_at: string;
}

function toInputDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export default function FacturesPage() {
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [rows, setRows] = useState<FactureRow[]>([]);
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    billingAddress: "",
    issueDate: toInputDate(),
    dueDate: toInputDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
    notes: "",
    lineItems: [{ description: "", quantity: 1, unitPrice: 0 }] as InvoiceLineItem[],
  });

  const totals = useMemo(() => computeInvoiceTotals(form.lineItems), [form.lineItems]);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.from("factures").select("*").order("created_at", { ascending: false });
    if (data) setRows(data as FactureRow[]);
    setLoading(false);
  };

  const nextInvoiceNumber = async () => {
    const year = new Date().getFullYear();
    const prefix = `FAC-${year}-`;
    const { data } = await supabase
      .from("factures")
      .select("invoice_number")
      .like("invoice_number", `${prefix}%`)
      .order("invoice_number", { ascending: false })
      .limit(1);
    const current = data?.[0]?.invoice_number ?? `${prefix}0000`;
    const last = Number(current.split("-").at(-1) ?? "0");
    return `${prefix}${String(last + 1).padStart(4, "0")}`;
  };

  const createInvoice = async () => {
    if (!form.companyName || !form.email || !form.billingAddress) return;
    const invoiceNumber = await nextInvoiceNumber();
    const { subtotal, vatAmount, total } = totals;
    const { error } = await supabase.from("factures").insert([
      {
        invoice_number: invoiceNumber,
        company_name: form.companyName,
        email: form.email,
        billing_address: form.billingAddress,
        issue_date: form.issueDate,
        due_date: form.dueDate,
        line_items: form.lineItems,
        notes: form.notes || null,
        subtotal,
        vat_rate: INVOICE_VAT_RATE,
        vat_amount: vatAmount,
        total,
        status: "draft",
      },
    ]);
    if (!error) {
      setForm((prev) => ({
        ...prev,
        companyName: "",
        email: "",
        billingAddress: "",
        notes: "",
        lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
      }));
      await refresh();
    }
  };

  const sendInvoice = async (invoice: FactureRow) => {
    setSendingId(invoice.id);
    try {
      await fetch("/api/factures/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: invoice.id,
          invoiceNumber: invoice.invoice_number,
          companyName: invoice.company_name,
          email: invoice.email,
          billingAddress: invoice.billing_address,
          issueDate: invoice.issue_date,
          dueDate: invoice.due_date,
          lineItems: invoice.line_items,
          notes: invoice.notes,
        }),
      });
      await refresh();
    } finally {
      setSendingId(null);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-charcoal flex items-center gap-3">
          <FileText className="w-8 h-8 text-kraft" />
          Factures (interne)
        </h1>
        <p className="font-sans text-muted mt-1">
          TVA fixe: {(INVOICE_VAT_RATE * 100).toFixed(1).replace(".", ",")} % - IDE/UID TVA{" "}
          {SWEET_EMBALLAGES_COMPANY.vatNumber}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border border-border rounded-xl p-2" placeholder="Entreprise" value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} />
          <input className="border border-border rounded-xl p-2" placeholder="Email client" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input type="date" className="border border-border rounded-xl p-2" value={form.issueDate} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} />
          <input type="date" className="border border-border rounded-xl p-2" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
        </div>
        <textarea className="border border-border rounded-xl p-2 w-full min-h-20" placeholder="Adresse de facturation" value={form.billingAddress} onChange={(e) => setForm((p) => ({ ...p, billingAddress: e.target.value }))} />
        {form.lineItems.map((line, index) => (
          <div key={index} className="grid md:grid-cols-[1fr_120px_120px_40px] gap-2">
            <input className="border border-border rounded-xl p-2" placeholder="Description" value={line.description} onChange={(e) => setForm((p) => ({ ...p, lineItems: p.lineItems.map((li, i) => (i === index ? { ...li, description: e.target.value } : li)) }))} />
            <input type="number" className="border border-border rounded-xl p-2" value={line.quantity} onChange={(e) => setForm((p) => ({ ...p, lineItems: p.lineItems.map((li, i) => (i === index ? { ...li, quantity: Number(e.target.value) } : li)) }))} />
            <input type="number" step="0.01" className="border border-border rounded-xl p-2" value={line.unitPrice} onChange={(e) => setForm((p) => ({ ...p, lineItems: p.lineItems.map((li, i) => (i === index ? { ...li, unitPrice: Number(e.target.value) } : li)) }))} />
            <button className="rounded-xl border border-border hover:bg-gray-50" onClick={() => setForm((p) => ({ ...p, lineItems: p.lineItems.filter((_, i) => i !== index) }))}>
              <Trash2 className="w-4 h-4 mx-auto" />
            </button>
          </div>
        ))}
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border" onClick={() => setForm((p) => ({ ...p, lineItems: [...p.lineItems, { description: "", quantity: 1, unitPrice: 0 }] }))}>
          <Plus className="w-4 h-4" /> Ajouter ligne
        </button>
        <textarea className="border border-border rounded-xl p-2 w-full min-h-16" placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
        <div className="font-sans text-sm text-charcoal">
          Sous-total: CHF {totals.subtotal.toFixed(2)} | TVA {(INVOICE_VAT_RATE * 100).toFixed(1).replace(".", ",")} %: CHF {totals.vatAmount.toFixed(2)} | Total TTC: CHF {totals.total.toFixed(2)}
        </div>
        <button className="px-4 py-2 rounded-xl bg-kraft text-white hover:bg-[#b09268]" onClick={() => void createInvoice()}>
          Créer facture
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">N°</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={5}>Chargement...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-3" colSpan={5}>Aucune facture.</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="p-3">{row.invoice_number}</td>
                <td className="p-3">{row.company_name}</td>
                <td className="p-3">CHF {Number(row.total).toFixed(2)}</td>
                <td className="p-3">{row.status === "sent" ? "Envoyée" : "Brouillon"}</td>
                <td className="p-3 text-right">
                  <button disabled={sendingId === row.id} onClick={() => void sendInvoice(row)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-50">
                    <Mail className="w-4 h-4" /> {sendingId === row.id ? "Envoi..." : "Envoyer PDF par mail"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
