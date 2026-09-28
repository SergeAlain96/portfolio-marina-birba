-- Rend la section « Géomatique » du site public modifiable depuis le dashboard admin.
-- Le contenu vit dans une ligne unique (table « geomatics »).
-- A coller dans Supabase > SQL Editor

create extension if not exists "pgcrypto";

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

create table if not exists public.geomatics (
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

alter table public.geomatics add column if not exists label text not null default '';
alter table public.geomatics add column if not exists title text not null default '';
alter table public.geomatics add column if not exists intro text not null default '';
alter table public.geomatics add column if not exists detail text not null default '';
alter table public.geomatics add column if not exists note text not null default '';
alter table public.geomatics add column if not exists pillars jsonb not null default '[]'::jsonb;
alter table public.geomatics add column if not exists fields_title text not null default '';
alter table public.geomatics add column if not exists fields jsonb not null default '[]'::jsonb;
alter table public.geomatics add column if not exists created_at timestamptz not null default now();
alter table public.geomatics add column if not exists updated_at timestamptz not null default now();
alter table public.geomatics alter column label set not null;
alter table public.geomatics alter column title set not null;
alter table public.geomatics alter column intro set not null;
alter table public.geomatics alter column detail set not null;
alter table public.geomatics alter column note set not null;
alter table public.geomatics alter column pillars set not null;
alter table public.geomatics alter column fields_title set not null;
alter table public.geomatics alter column fields set not null;
alter table public.geomatics alter column created_at set not null;
alter table public.geomatics alter column updated_at set not null;

-- Nettoie et valide les listes avant chaque ecriture, met a jour updated_at
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

drop trigger if exists geomatics_normalize on public.geomatics;
create trigger geomatics_normalize
before insert or update on public.geomatics
for each row execute function public.geomatics_normalize();

alter table public.geomatics enable row level security;

drop policy if exists "public read geomatics" on public.geomatics;
drop policy if exists "admin manage geomatics" on public.geomatics;

create policy "public read geomatics"
on public.geomatics
for select
to anon, authenticated
using (true);

create policy "admin manage geomatics"
on public.geomatics
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

grant select on public.geomatics to anon, authenticated;
grant insert, update, delete on public.geomatics to authenticated;
grant execute on function public.is_portfolio_admin() to authenticated;

-- Contenu actuel repris tel quel, uniquement si la table est encore vide
insert into public.geomatics (label, title, intro, detail, note, pillars, fields_title, fields)
select
  '',
  'C''est quoi, la géomatique ?',
  'La géomatique est l''ensemble des sciences, des technologies et des méthodes qui permettent d''acquérir, de traiter, de stocker et de restituer des données localisées dans l''espace. Elle fait dialoguer la cartographie, la topographie, la télédétection, l''informatique et les sciences de la Terre.',
  'Concrètement, la géomaticienne ou le géomaticien transforme les observations du terrain et les images satellitaires en informations exploitables : cartes, bases de données, modèles d''analyse et outils d''aide à la décision.',
  '« Géo- » pour la Terre, « -matique » pour les méthodes mathématiques appliquées à la matière et à l''espace.',
  '[
    {"icon": "gps", "title": "Acquisition", "text": "Levés topographiques, GNSS, drones, imagerie satellitaire et campagnes de terrain pour capter l''information spatiale."},
    {"icon": "settings", "title": "Traitement", "text": "Géoréférencement, nettoyage, analyse spatiale et modélisation pour transformer les données brutes en information fiable."},
    {"icon": "database", "title": "Stockage", "text": "Bases de données géospatiales (PostGIS, fichiers géoréférencés) structurées pour être interrogeables et réutilisables."},
    {"icon": "map", "title": "Restitution", "text": "Cartographie thématique, atlas, cartes web et tableaux de bord pour rendre l''information lisible et partageable."}
  ]'::jsonb,
  'Domaines d''application',
  '[
    "Urbanisme et aménagement",
    "Environnement",
    "Agriculture",
    "Risques naturels",
    "Mobilité et réseaux",
    "Gestion foncière"
  ]'::jsonb
where not exists (select 1 from public.geomatics);
