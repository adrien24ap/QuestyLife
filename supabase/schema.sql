create table if not exists public.questylife_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.questylife_data enable row level security;

create policy "Users can read their own QuestyLife data"
on public.questylife_data
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own QuestyLife data"
on public.questylife_data
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own QuestyLife data"
on public.questylife_data
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
