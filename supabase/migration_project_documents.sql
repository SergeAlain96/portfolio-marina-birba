-- Plusieurs documents par projet (au lieu d'un seul via projects.document_url)
-- A coller dans Supabase > SQL Editor

create table if not exists project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  document_url text not null,
  label text,
  created_at timestamp default now()
);

alter table project_documents enable row level security;

drop policy if exists "public read project_documents" on project_documents;
drop policy if exists "auth write project_documents" on project_documents;

create policy "public read project_documents" on project_documents
  for select using (true);
create policy "auth write project_documents" on project_documents
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Reprend l'eventuel document unique deja renseigne
insert into project_documents (project_id, document_url)
select id, document_url
from projects
where document_url is not null
  and not exists (
    select 1 from project_documents d where d.project_id = projects.id
  );

-- L'ancienne colonne n'est plus utilisee par l'application.
-- A executer une fois la migration verifiee :
-- alter table projects drop column document_url;
