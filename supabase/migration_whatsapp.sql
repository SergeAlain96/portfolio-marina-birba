-- Ajoute un champ WhatsApp distinct du telephone
-- Tous les numeros de "phone" ne sont pas forcement joignables sur WhatsApp.
-- A coller dans Supabase > SQL Editor

alter table profiles add column if not exists whatsapp text;

-- le 64986669 est le numero WhatsApp, le 69953186 reste en appel simple
update profiles
set whatsapp = '+226 64986669',
    phone = '+226 69953186'
where whatsapp is null;
