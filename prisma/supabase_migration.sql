-- =============================================
-- Sweet Emballages – Migration
-- Create contact_messages, demandes_devis, contact_info tables
-- Run this in your Supabase SQL Editor
-- (/acces page uses a fixed PIN in code, no DB table.)
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

-- Allow authenticated users (admin) to do everything
CREATE POLICY "Admin can manage contact messages"
    ON contact_messages FOR ALL
    TO authenticated
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

-- Allow authenticated users (admin) to do everything
CREATE POLICY "Admin can manage demandes devis"
    ON demandes_devis FOR ALL
    TO authenticated
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

-- Only authenticated admin can update
CREATE POLICY "Admin can update contact info"
    ON contact_info FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
