-- =============================================
-- Sweet Emballages – Migration
-- Create contact_messages and demandes_devis tables
-- Run this in your Supabase SQL Editor
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
