create table if not exists decision (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  situation_text text not null,
  decision_text text not null,
  reasoning_text text,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc', now()),
  analysis_result jsonb
);

alter table decision enable row level security;

create policy "Users can view their own decisions" on decision
  for select using (auth.uid() = user_id);

create policy "Users can insert their own decisions" on decision
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own decisions" on decision
  for update using (auth.uid() = user_id);

create policy "Users can delete their own decisions" on decision
  for delete using (auth.uid() = user_id);
