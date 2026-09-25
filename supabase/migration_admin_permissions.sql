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

alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_documents enable row level security;
alter table public.messages enable row level security;

drop policy if exists "auth write profiles" on public.profiles;
drop policy if exists "auth write experiences" on public.experiences;
drop policy if exists "auth write education" on public.education;
drop policy if exists "auth write skills" on public.skills;
drop policy if exists "auth write projects" on public.projects;
drop policy if exists "auth write project_images" on public.project_images;
drop policy if exists "auth write project_documents" on public.project_documents;
drop policy if exists "auth read messages" on public.messages;
drop policy if exists "auth delete messages" on public.messages;
drop policy if exists "admin manage profiles" on public.profiles;
drop policy if exists "admin manage experiences" on public.experiences;
drop policy if exists "admin manage education" on public.education;
drop policy if exists "admin manage skills" on public.skills;
drop policy if exists "admin manage projects" on public.projects;
drop policy if exists "admin manage project_images" on public.project_images;
drop policy if exists "admin manage project_documents" on public.project_documents;
drop policy if exists "admin read messages" on public.messages;
drop policy if exists "admin delete messages" on public.messages;

create policy "admin manage profiles"
on public.profiles
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admin manage experiences"
on public.experiences
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admin manage education"
on public.education
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admin manage skills"
on public.skills
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admin manage projects"
on public.projects
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admin manage project_images"
on public.project_images
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admin manage project_documents"
on public.project_documents
for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admin read messages"
on public.messages
for select
to authenticated
using (public.is_portfolio_admin());

create policy "admin delete messages"
on public.messages
for delete
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "auth write media" on storage.objects;
drop policy if exists "auth update media" on storage.objects;
drop policy if exists "auth delete media" on storage.objects;
drop policy if exists "admin write media" on storage.objects;
drop policy if exists "admin update media" on storage.objects;
drop policy if exists "admin delete media" on storage.objects;

create policy "admin write media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media' and public.is_portfolio_admin());

create policy "admin update media"
on storage.objects
for update
to authenticated
using (bucket_id = 'media' and public.is_portfolio_admin())
with check (bucket_id = 'media' and public.is_portfolio_admin());

create policy "admin delete media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media' and public.is_portfolio_admin());
