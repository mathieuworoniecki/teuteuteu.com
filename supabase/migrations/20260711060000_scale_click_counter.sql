begin;

do $$
begin
  if to_regclass('public.site_stats_legacy') is null then
    alter table public.site_stats rename to site_stats_legacy;
  end if;
end;
$$;

create table if not exists public.click_counter_shards (
  shard_id smallint primary key check (shard_id between 0 and 63),
  total_clicks bigint not null default 0 check (total_clicks >= 0),
  updated_at timestamptz not null default now()
);

insert into public.click_counter_shards (shard_id, total_clicks, updated_at)
select shard_id,
       case when shard_id = 0 then legacy.total_clicks else 0 end,
       legacy.updated_at
from generate_series(0, 63) as shard_id
cross join public.site_stats_legacy as legacy
where legacy.id = 1
on conflict (shard_id) do nothing;

alter table public.click_counter_shards enable row level security;
alter table public.click_rate_limits enable row level security;
alter table public.supporters enable row level security;
alter table public.site_stats_legacy enable row level security;

revoke all on table public.click_counter_shards from public, anon, authenticated;
revoke all on table public.site_stats_legacy from public, anon, authenticated;

create or replace view public.site_stats
with (security_invoker = true)
as
select 1::smallint as id,
       coalesce(sum(total_clicks), 0)::bigint as total_clicks,
       coalesce(max(updated_at), now()) as updated_at
from public.click_counter_shards;

revoke all on table public.site_stats from public, anon, authenticated;
grant select on table public.site_stats to service_role;
grant select, update on table public.click_counter_shards to service_role;

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
    update public.click_counter_shards
       set total_clicks = total_clicks + 1,
           updated_at = now_at
     where shard_id = selected_shard;
  end if;

  select stats.total_clicks into new_total
    from public.site_stats as stats
   where stats.id = 1;

  return query select new_total, not accepted;
end;
$$;

revoke execute on function public.increment_teuteuteu_click(text) from public, anon, authenticated;
grant execute on function public.increment_teuteuteu_click(text) to service_role;

create or replace function public.cleanup_teuteuteu_click_rate_limits(
  p_batch_size integer default 10000,
  p_max_batches integer default 5
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_in_batch integer := 0;
  deleted_total integer := 0;
  batch_number integer := 0;
begin
  loop
    exit when batch_number >= greatest(1, least(p_max_batches, 20));

    delete from public.click_rate_limits
     where ctid in (
       select ctid
         from public.click_rate_limits
        where updated_at < now() - interval '2 hours'
        order by updated_at
        limit greatest(1, least(p_batch_size, 50000))
     );

    get diagnostics deleted_in_batch = row_count;
    deleted_total := deleted_total + deleted_in_batch;
    batch_number := batch_number + 1;
    exit when deleted_in_batch < greatest(1, least(p_batch_size, 50000));
  end loop;

  return deleted_total;
end;
$$;

revoke execute on function public.cleanup_teuteuteu_click_rate_limits(integer, integer)
  from public, anon, authenticated;
grant execute on function public.cleanup_teuteuteu_click_rate_limits(integer, integer)
  to service_role;

select cron.unschedule(jobid)
from cron.job
where jobname = 'teuteuteu-clean-click-rate-limits';

select cron.schedule(
  'teuteuteu-clean-click-rate-limits',
  '17 * * * *',
  $$select public.cleanup_teuteuteu_click_rate_limits(10000, 5)$$
);

commit;
