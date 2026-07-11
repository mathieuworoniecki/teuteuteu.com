create or replace function public.increment_teuteuteu_click(p_visitor_hash text)
returns table(total_clicks bigint, limited boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  now_at timestamptz := clock_timestamp();
  accepted boolean := false;
  selected_shard smallint;
  new_total bigint;
begin
  insert into public.click_rate_limits (visitor_hash, window_started_at, presses, updated_at)
  values (p_visitor_hash, now_at, 1, now_at)
  on conflict (visitor_hash) do update
    set window_started_at = case
          when click_rate_limits.window_started_at < now_at - interval '1 minute' then now_at
          else click_rate_limits.window_started_at
        end,
        presses = case
          when click_rate_limits.window_started_at < now_at - interval '1 minute' then 1
          else click_rate_limits.presses + 1
        end,
        updated_at = now_at
    where click_rate_limits.window_started_at < now_at - interval '1 minute'
       or click_rate_limits.presses < 60
  returning true into accepted;

  accepted := coalesce(accepted, false);

  if accepted then
    selected_shard := (get_byte(decode(p_visitor_hash, 'hex'), 0) % 64)::smallint;
    update public.click_counter_shards as shards
       set total_clicks = shards.total_clicks + 1,
           updated_at = now_at
     where shards.shard_id = selected_shard;
  end if;

  select stats.total_clicks into new_total
    from public.site_stats as stats
   where stats.id = 1;

  return query select new_total, not accepted;
end;
$$;

revoke execute on function public.increment_teuteuteu_click(text) from public, anon, authenticated;
grant execute on function public.increment_teuteuteu_click(text) to service_role;
