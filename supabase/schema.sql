-- Run in Supabase > SQL Editor
create table if not exists invitation (
  id int primary key default 1 check (id = 1),
  content jsonb not null,
  updated_at timestamptz default now()
);
alter table invitation enable row level security;
create policy "public read" on invitation for select using (true);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  guests int default 1,
  attending boolean default true,
  message text,
  created_at timestamptz default now()
);
alter table rsvps enable row level security; -- no policies: only the server (service key) can read/write

-- Then: Authentication > Users > Add user (your admin email + password).
-- Put the same email in ADMIN_EMAILS in .env.

-- ===== Image uploads for decorations (run this too) =====
insert into storage.buckets (id, name, public) values ('invitation', 'invitation', true) on conflict do nothing;
create policy "public read images" on storage.objects for select using (bucket_id = 'invitation');
create policy "admin upload images" on storage.objects for insert to authenticated with check (bucket_id = 'invitation');
create policy "admin delete images" on storage.objects for delete to authenticated using (bucket_id = 'invitation');
-- Also: Authentication > Providers > Email > turn OFF "Allow new users to sign up".
