-- Optional intro line shown under the headline; empty means the page uses the default wording.
alter table public.profiles
  add column intro text not null default '' check (char_length(intro) <= 300);

drop function public.public_profile(text);

create function public.public_profile(h text)
returns table (display_name text, headline text, intro text)
language sql stable security definer set search_path = public
as $$ select display_name, headline, intro from public.profiles where handle = lower(h) $$;

revoke all on function public.public_profile(text) from public;
grant execute on function public.public_profile(text) to anon, authenticated;
