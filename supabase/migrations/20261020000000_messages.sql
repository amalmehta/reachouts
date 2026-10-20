-- A log of everyone who reached out, so owners can see their history on the account page.
create table public.messages (
  id bigserial primary key,
  profile_id uuid not null references public.profiles on delete cascade,
  sender_email text not null,
  message text, -- null for messages sent before the log existed
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
create index messages_profile_time on public.messages (profile_id, created_at desc);

create policy "Read own messages" on public.messages
  for select using (auth.uid() = profile_id);

-- Backfill who reached out (and when) from the rate-limit log; message text wasn't kept before.
insert into public.messages (profile_id, sender_email, created_at)
select profile_id, sender_email, created_at from public.sends;
