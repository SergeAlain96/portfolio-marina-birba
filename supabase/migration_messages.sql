-- Table des messages du formulaire de contact.
-- Elle n'a jamais ete creee : le formulaire public echoue sans elle.
-- A coller dans Supabase > SQL Editor

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamp default now()
);

alter table messages enable row level security;

-- n'importe qui peut envoyer un message, seule l'admin connectee peut les lire
drop policy if exists "public insert messages" on messages;
drop policy if exists "auth read messages" on messages;
drop policy if exists "auth delete messages" on messages;

create policy "public insert messages" on messages for insert with check (true);
create policy "auth read messages" on messages for select using (auth.role() = 'authenticated');
create policy "auth delete messages" on messages for delete using (auth.role() = 'authenticated');
