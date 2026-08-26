-- Ajoute un document (rapport PDF/Word) telechargeable par projet
-- A coller dans Supabase > SQL Editor

alter table projects add column if not exists document_url text;
