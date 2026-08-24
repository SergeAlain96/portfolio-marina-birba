-- Bucket de stockage pour photos, CV, images de projets
-- À coller dans Supabase > SQL Editor (après schema.sql)

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
on storage.objects for select
using (bucket_id = 'media');

create policy "auth write media"
on storage.objects for insert
with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "auth update media"
on storage.objects for update
using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "auth delete media"
on storage.objects for delete
using (bucket_id = 'media' and auth.role() = 'authenticated');
