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

  select limits.presses into current_presses
  from public.click_rate_limits as limits
  where limits.visitor_hash = p_visitor_hash
  for update;

  if (select limits.window_started_at < now_at - interval '1 minute' from public.click_rate_limits as limits where limits.visitor_hash = p_visitor_hash) then
    update public.click_rate_limits as limits
    set window_started_at = now_at, presses = 1, updated_at = now_at
    where limits.visitor_hash = p_visitor_hash;
    accepted := true;
  elsif current_presses < 60 then
    update public.click_rate_limits as limits
    set presses = limits.presses + 1, updated_at = now_at
    where limits.visitor_hash = p_visitor_hash;
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

revoke execute on function public.increment_teuteuteu_click(text) from public, anon, authenticated;
grant execute on function public.increment_teuteuteu_click(text) to service_role;
