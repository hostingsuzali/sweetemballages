-- =============================================
-- Sweet Emballages – Migration
-- Run this in your Supabase / PostgreSQL SQL Editor
-- =============================================

-- =============================================
-- 0. users + admin_sessions (custom auth — replaces Supabase Auth)
-- =============================================

CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    token      TEXT NOT NULL UNIQUE,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions(expires_at);

-- =============================================

-- 1. contact_messages (formulaire de contact general)
CREATE TABLE IF NOT EXISTS contact_messages (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    company_name TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    message     TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT (so the public contact form can write)
CREATE POLICY "Public can insert contact messages"
    ON contact_messages FOR INSERT
    TO anon
    WITH CHECK (true);

-- This app never authenticates via Supabase Auth (custom Prisma-based admin
-- sessions only) — the anon-key client is what the admin browser actually uses.
-- A "TO authenticated" policy here would never match real admin traffic.
CREATE POLICY "Anon can manage contact messages"
    ON contact_messages FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================

-- 2. demandes_devis (formulaire de personnalisation/devis)
CREATE TABLE IF NOT EXISTS demandes_devis (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    company_name TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    message     TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE demandes_devis ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT (so the public contact form can write)
CREATE POLICY "Public can insert demandes devis"
    ON demandes_devis FOR INSERT
    TO anon
    WITH CHECK (true);

-- See note above re: this app's anon-key-only admin traffic.
CREATE POLICY "Anon can manage demandes devis"
    ON demandes_devis FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- 3. contact_info (single row: phone, email, address – editable in admin)
-- =============================================

CREATE TABLE IF NOT EXISTS contact_info (
    id                  TEXT PRIMARY KEY DEFAULT 'default',
    phone               TEXT,
    phone_hours         TEXT,
    email               TEXT,
    email_response_time TEXT,
    address_line1       TEXT,
    address_line2       TEXT,
    address_country     TEXT
);

-- Insert default row so the site has values until admin edits
INSERT INTO contact_info (
    id, phone, phone_hours, email, email_response_time,
    address_line1, address_line2, address_country
) VALUES (
    'default',
    '076 504 10 69',
    'Lun–ven, 8h–18h',
    'contact@sweetemballages.ch',
    'Réponse sous 24h ouvrées',
    'Route de la Venoge 2',
    '1302 Vufflens-la-Ville',
    'Suisse'
) ON CONFLICT (id) DO NOTHING;

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Public can read contact info (for contact page and footer)
CREATE POLICY "Public can read contact info"
    ON contact_info FOR SELECT
    TO anon
    USING (true);

-- See note above re: this app's anon-key-only admin traffic.
CREATE POLICY "Anon can update contact info"
    ON contact_info FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- 4. factures (gestion interne uniquement)
-- =============================================

CREATE TABLE IF NOT EXISTS factures (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    invoice_number  TEXT NOT NULL UNIQUE,
    company_name    TEXT NOT NULL,
    email           TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    issue_date      DATE NOT NULL,
    due_date        DATE NOT NULL,
    line_items      JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes           TEXT,
    subtotal        NUMERIC(12, 2) NOT NULL DEFAULT 0,
    vat_rate        NUMERIC(5, 4) NOT NULL DEFAULT 0.0810,
    vat_amount      NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total           NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'draft',
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE factures ENABLE ROW LEVEL SECURITY;

-- See note above re: this app's anon-key-only admin traffic.
CREATE POLICY "Anon can manage factures"
    ON factures FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- 5. devis (devis chiffres, lies aux demandes_devis, convertibles en factures)
-- =============================================

ALTER TABLE demandes_devis
  ALTER COLUMN message DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS items JSONB;

CREATE TABLE IF NOT EXISTS devis (
    id                    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    devis_number          TEXT NOT NULL UNIQUE,
    demande_devis_id      TEXT REFERENCES demandes_devis(id) ON DELETE SET NULL,
    company_name          TEXT NOT NULL,
    email                 TEXT NOT NULL,
    billing_address       TEXT,
    issue_date            DATE NOT NULL,
    valid_until           DATE NOT NULL,
    line_items            JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes                 TEXT,
    subtotal              NUMERIC(12, 2) NOT NULL DEFAULT 0,
    vat_rate              NUMERIC(5, 4) NOT NULL DEFAULT 0.0810,
    vat_amount            NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total                 NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status                TEXT NOT NULL DEFAULT 'draft',
    sent_at               TIMESTAMPTZ,
    converted_facture_id  TEXT UNIQUE REFERENCES factures(id) ON DELETE SET NULL,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS devis_demande_devis_id_idx ON devis(demande_devis_id);
CREATE INDEX IF NOT EXISTS devis_status_idx ON devis(status);

ALTER TABLE devis ENABLE ROW LEVEL SECURITY;

-- Cette appli n'utilise jamais Supabase Auth (sessions admin maison via Prisma) : le
-- client anon-key est ce qui est reellement utilise cote navigateur admin (cf.
-- ProductForm.tsx, factures/page.tsx, DevisClient.tsx). On aligne la policy sur la
-- realite du trafic plutot que de copier le pattern "TO authenticated" deja
-- incoherent des tables existantes (qu'on ne touche pas ici).
CREATE POLICY "Anon can manage devis"
    ON devis FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- 6. Fixup: restore missing `id` defaults
-- =============================================
-- contact_messages.id / demandes_devis.id / factures.id were found with no
-- DEFAULT on the live database (column drifted from this file's original
-- CREATE TABLE, which only runs once thanks to IF NOT EXISTS). Without a
-- default, every insert that doesn't supply an id 500s with a NOT NULL
-- violation. Safe to re-run.
ALTER TABLE contact_messages ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE demandes_devis ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE factures ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
