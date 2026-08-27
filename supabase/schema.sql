-- Portfolio Marina Birba — schéma initial
-- À coller dans Supabase > SQL Editor

create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key default gen_random_uuid(),
  fullname text,
  title text,
  bio text,
  photo_url text,
  cv_url text,
  email text,
  phone text,
  whatsapp text,
  linkedin text,
  created_at timestamp default now()
);

create table experiences (
  id uuid primary key default gen_random_uuid(),
  title text,
  company text,
  location text,
  start_date date,
  end_date date,
  description text,
  created_at timestamp default now()
);

create table education (
  id uuid primary key default gen_random_uuid(),
  degree text,
  institution text,
  country text,
  year text,
  created_at timestamp default now()
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  name text,
  category text,
  created_at timestamp default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  cover_image text,
  document_url text,
  project_date date,
  created_at timestamp default now()
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  image_url text,
  created_at timestamp default now()
);

create table project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  document_url text not null,
  label text,
  created_at timestamp default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamp default now()
);

-- Lecture publique, écriture réservée aux utilisateurs authentifiés (admin)
alter table profiles enable row level security;
alter table experiences enable row level security;
alter table education enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table project_documents enable row level security;
alter table messages enable row level security;

create policy "public read profiles" on profiles for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read education" on education for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read project_images" on project_images for select using (true);
create policy "public read project_documents" on project_documents for select using (true);

create policy "auth write profiles" on profiles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write experiences" on experiences for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write education" on education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write skills" on skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write project_images" on project_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write project_documents" on project_documents for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- messages : n'importe qui peut envoyer, seule l'admin authentifiee peut lire/gerer
create policy "public insert messages" on messages for insert with check (true);
create policy "auth read messages" on messages for select using (auth.role() = 'authenticated');
create policy "auth delete messages" on messages for delete using (auth.role() = 'authenticated');
