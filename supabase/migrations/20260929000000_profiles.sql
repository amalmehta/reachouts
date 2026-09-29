-- One profile per signed-in person. Their inbox is their (verified) sign-in email,
-- which lives in auth.users and is never exposed to visitors.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9-]{3,30}$'),
  display_name text not null check (char_length(display_name) between 1 and 60),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Create own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Visitors only ever learn the display name behind a handle.
create function public.public_profile(h text)
returns table (display_name text)
language sql stable security definer set search_path = public
as $$ select display_name from public.profiles where handle = lower(h) $$;

revoke all on function public.public_profile(text) from public;
grant execute on function public.public_profile(text) to anon, authenticated;

-- Log of sent messages, used for rate limiting. Only the send-message function touches it.
create table public.sends (
  id bigserial primary key,
  profile_id uuid not null references public.profiles on delete cascade,
  sender_email text not null,
  created_at timestamptz not null default now()
);

alter table public.sends enable row level security;
create index sends_profile_time on public.sends (profile_id, created_at);
create index sends_sender_time on public.sends (sender_email, created_at);
