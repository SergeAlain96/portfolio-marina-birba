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

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

revoke execute on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  image_url text,
  status text not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint services_title_length check (char_length(btrim(title)) between 1 and 160),
  constraint services_description_length check (char_length(btrim(description)) between 1 and 5000),
  constraint services_icon_values check (
    icon is null or icon in ('briefcase', 'map', 'chart', 'code', 'palette', 'database', 'settings', 'sparkles')
  ),
  constraint services_image_url_length check (
    image_url is null or char_length(btrim(image_url)) between 1 and 2000
  ),
  constraint services_image_url_format check (
    image_url is null or image_url ~ '^https?://'
  ),
  constraint services_status_values check (status in ('published', 'draft')),
  constraint services_display_order_range check (display_order between 0 and 9999),
  constraint services_visual_required check (icon is not null or image_url is not null)
);

create or replace function public.set_services_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger services_updated_at
before update on services
for each row execute function public.set_services_updated_at();

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
alter table services enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table project_documents enable row level security;
alter table messages enable row level security;

create policy "public read profiles" on profiles for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read education" on education for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read published services" on services
  for select to anon, authenticated
  using (status = 'published');
create policy "public read projects" on projects for select using (true);
create policy "public read project_images" on project_images for select using (true);
create policy "public read project_documents" on project_documents for select using (true);

create policy "admin manage profiles"
  on profiles for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admin manage experiences"
  on experiences for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admin manage education"
  on education for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admin manage skills"
  on skills for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admin manage services"
  on services for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admin manage projects"
  on projects for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admin manage project_images"
  on project_images for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admin manage project_documents"
  on project_documents for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- messages : n'importe qui peut envoyer, seule l'admin authentifiee peut lire/gerer
create policy "public insert messages" on messages for insert with check (true);
create policy "admin read messages"
  on messages for select to authenticated
  using (public.is_portfolio_admin());
create policy "admin delete messages"
  on messages for delete to authenticated
  using (public.is_portfolio_admin());

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'services'
  ) then
    alter publication supabase_realtime add table services;
  end if;
end;
$$;
