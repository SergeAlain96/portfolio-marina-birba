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

create table if not exists public.services (
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

alter table public.services add column if not exists title text;
alter table public.services add column if not exists description text;
alter table public.services add column if not exists icon text;
alter table public.services add column if not exists image_url text;
alter table public.services add column if not exists status text not null default 'draft';
alter table public.services add column if not exists display_order integer not null default 0;
alter table public.services add column if not exists created_at timestamptz not null default now();
alter table public.services add column if not exists updated_at timestamptz not null default now();
alter table public.services alter column title set not null;
alter table public.services alter column description set not null;
alter table public.services alter column status set not null;
alter table public.services alter column display_order set not null;
alter table public.services alter column created_at set not null;
alter table public.services alter column updated_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_title_length' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_title_length
      check (char_length(btrim(title)) between 1 and 160);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_description_length' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_description_length
      check (char_length(btrim(description)) between 1 and 5000);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_icon_values' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_icon_values
      check (icon is null or icon in ('briefcase', 'map', 'chart', 'code', 'palette', 'database', 'settings', 'sparkles'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_image_url_length' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_image_url_length
      check (image_url is null or char_length(btrim(image_url)) between 1 and 2000);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_image_url_format' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_image_url_format
      check (image_url is null or image_url ~ '^https?://');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_status_values' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_status_values
      check (status in ('published', 'draft'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_display_order_range' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_display_order_range
      check (display_order between 0 and 9999);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'services_visual_required' and conrelid = 'public.services'::regclass
  ) then
    alter table public.services add constraint services_visual_required
      check (icon is not null or image_url is not null);
  end if;
end;
$$;

alter table public.services replica identity full;

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

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
before update on public.services
for each row execute function public.set_services_updated_at();

alter table public.services enable row level security;

drop policy if exists "public read services" on public.services;
drop policy if exists "public read published services" on public.services;
drop policy if exists "auth write services" on public.services;
drop policy if exists "admin manage services" on public.services;

create policy "public read published services"
on public.services
for select
to anon, authenticated
using (status = 'published');

create policy "admin manage services"
on public.services
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant execute on function public.is_portfolio_admin() to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'services'
  ) then
    alter publication supabase_realtime add table public.services;
  end if;
end;
$$;
