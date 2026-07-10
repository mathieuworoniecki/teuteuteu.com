create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'teuteuteu-clean-click-rate-limits',
  '17 3 * * *',
  $$delete from public.click_rate_limits where updated_at < now() - interval '48 hours'$$
);
