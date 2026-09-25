-- Bucket de stockage pour photos, CV, images de projets
-- À coller dans Supabase > SQL Editor (après schema.sql, qui définit public.is_portfolio_admin)

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read media" on storage.objects;
drop policy if exists "auth write media" on storage.objects;
drop policy if exists "auth update media" on storage.objects;
drop policy if exists "auth delete media" on storage.objects;
drop policy if exists "admin write media" on storage.objects;
drop policy if exists "admin update media" on storage.objects;
drop policy if exists "admin delete media" on storage.objects;

create policy "public read media"
on storage.objects for select
using (bucket_id = 'media');

create policy "admin write media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media' and public.is_portfolio_admin());

create policy "admin update media"
on storage.objects for update
to authenticated
using (bucket_id = 'media' and public.is_portfolio_admin())
with check (bucket_id = 'media' and public.is_portfolio_admin());

create policy "admin delete media"
on storage.objects for delete
to authenticated
using (bucket_id = 'media' and public.is_portfolio_admin());
