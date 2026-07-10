create table if not exists public.site_stats (
  id smallint primary key check (id = 1),
  total_clicks bigint not null default 0 check (total_clicks >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_stats (id, total_clicks) values (1, 0) on conflict (id) do nothing;

create table if not exists public.supporters (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  provider_donation_id text not null,
  display_name text not null check (char_length(display_name) between 1 and 64),
  received_at timestamptz not null,
  is_visible boolean not null default true,
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists supporters_visible_received_at_idx on public.supporters (is_visible, received_at desc);
create index if not exists supporters_provider_donation_id_idx on public.supporters (provider_donation_id);

create table if not exists public.click_rate_limits (
  visitor_hash text primary key,
  window_started_at timestamptz not null,
  presses integer not null default 0 check (presses >= 0),
  updated_at timestamptz not null default now()
);

create or replace function public.increment_teuteuteu_click(p_visitor_hash text)
returns table(total_clicks bigint, limited boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  now_at timestamptz := now();
  current_presses integer;
  accepted boolean := false;
  new_total bigint;
begin
  insert into public.click_rate_limits (visitor_hash, window_started_at, presses, updated_at)
  values (p_visitor_hash, now_at, 0, now_at)
  on conflict (visitor_hash) do nothing;

  select presses into current_presses
  from public.click_rate_limits
  where visitor_hash = p_visitor_hash
  for update;

  if (select window_started_at < now_at - interval '1 minute' from public.click_rate_limits where visitor_hash = p_visitor_hash) then
    update public.click_rate_limits
    set window_started_at = now_at, presses = 1, updated_at = now_at
    where visitor_hash = p_visitor_hash;
    accepted := true;
  elsif current_presses < 60 then
    update public.click_rate_limits
    set presses = presses + 1, updated_at = now_at
    where visitor_hash = p_visitor_hash;
    accepted := true;
  end if;

  if accepted then
    update public.site_stats as stats
    set total_clicks = stats.total_clicks + 1, updated_at = now_at
    where stats.id = 1
    returning stats.total_clicks into new_total;
  else
    select stats.total_clicks into new_total from public.site_stats as stats where stats.id = 1;
  end if;

  return query select new_total, not accepted;
end;
$$;

revoke all on table public.site_stats, public.supporters, public.click_rate_limits from anon, authenticated;
revoke execute on function public.increment_teuteuteu_click(text) from public, anon, authenticated;
grant execute on function public.increment_teuteuteu_click(text) to service_role;
