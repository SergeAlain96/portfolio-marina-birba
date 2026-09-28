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

-- Section « Géomatique » du site public, modifiable via le dashboard admin
create table if not exists geomatics (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  title text not null default '',
  intro text not null default '',
  detail text not null default '',
  note text not null default '',
  pillars jsonb not null default '[]'::jsonb,
  fields_title text not null default '',
  fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.geomatics_normalize()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  element jsonb;
  cleaned_pillars jsonb := '[]'::jsonb;
  cleaned_fields jsonb := '[]'::jsonb;
  icon_value text;
  field_value text;
begin
  new.label := btrim(coalesce(new.label, ''));
  new.title := btrim(coalesce(new.title, ''));
  new.intro := coalesce(new.intro, '');
  new.detail := coalesce(new.detail, '');
  new.note := coalesce(new.note, '');
  new.fields_title := btrim(coalesce(new.fields_title, ''));
  new.pillars := coalesce(new.pillars, '[]'::jsonb);
  new.fields := coalesce(new.fields, '[]'::jsonb);

  if new.title = '' then
    raise exception 'Le titre de la section est obligatoire.';
  end if;

  if jsonb_typeof(new.pillars) <> 'array' then
    raise exception 'Les piliers doivent former une liste.';
  end if;

  for element in select value from jsonb_array_elements(new.pillars)
  loop
    if jsonb_typeof(element) <> 'object' then
      raise exception 'Chaque pilier doit contenir un titre, une icone et un texte.';
    end if;

    if btrim(coalesce(element ->> 'title', '')) = '' then
      raise exception 'Chaque pilier doit avoir un titre.';
    end if;

    icon_value := coalesce(nullif(btrim(coalesce(element ->> 'icon', '')), ''), 'map');
    if icon_value not in ('gps', 'settings', 'database', 'map') then
      raise exception 'Icone de pilier inconnue : %', icon_value;
    end if;

    cleaned_pillars := cleaned_pillars || jsonb_build_array(
      jsonb_build_object(
        'icon', icon_value,
        'title', btrim(element ->> 'title'),
        'text', btrim(coalesce(element ->> 'text', ''))
      )
    );
  end loop;

  if jsonb_typeof(new.fields) <> 'array' then
    raise exception 'Les domaines d''application doivent former une liste.';
  end if;

  for element in select value from jsonb_array_elements(new.fields)
  loop
    if jsonb_typeof(element) <> 'string' then
      raise exception 'Chaque domaine d''application doit etre un texte.';
    end if;

    field_value := btrim(element #>> '{}');
    if field_value <> '' then
      cleaned_fields := cleaned_fields || jsonb_build_array(field_value);
    end if;
  end loop;

  new.pillars := cleaned_pillars;
  new.fields := cleaned_fields;
  new.updated_at := timezone('utc', now());

  return new;
end;
$$;

create trigger geomatics_normalize
before insert or update on geomatics
for each row execute function public.geomatics_normalize();

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
alter table geomatics enable row level security;

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
create policy "public read geomatics" on geomatics for select using (true);

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
create policy "admin manage geomatics"
  on geomatics for all to authenticated
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
