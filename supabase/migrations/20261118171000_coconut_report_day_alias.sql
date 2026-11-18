create or replace function public.coconut_stats_report(access_hash text, days integer)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  first_day date := (now() at time zone 'UTC')::date - (least(90, greatest(1, days)) - 1);
begin
  if not exists (select 1 from coconut_analytics.owner_keys where key_hash = access_hash) then
    return null;
  end if;

  return (
    with data as materialized (
      select * from coconut_analytics.events where received_at >= (first_day::timestamp at time zone 'UTC')
    ),
    totals as (
      select count(*) filter (where event_type = 'page_view') as pageviews,
        count(distinct session_id) filter (where event_type in ('page_view','play_start')) as sessions,
        count(*) filter (where event_type = 'series_view') as series_views,
        count(*) filter (where event_type = 'play_start') as plays,
        count(*) filter (where event_type = 'play_complete') as completions,
        coalesce(sum(seconds) filter (where event_type = 'watch_time'),0) as seconds,
        count(*) filter (where event_type = 'ad_impression') as impressions,
        count(*) filter (where event_type = 'ad_click') as clicks
      from data
    ),
    by_day as (
      select (received_at at time zone 'UTC')::date as day,
        count(*) filter (where event_type = 'page_view') as pageviews,
        count(*) filter (where event_type = 'play_start') as plays
      from data group by 1
    ),
    calendar as (
      select series.day::date as day, coalesce(by_day.pageviews,0) as pageviews, coalesce(by_day.plays,0) as plays
      from generate_series(first_day::timestamp, date_trunc('day',now() at time zone 'UTC'), interval '1 day') series(day)
      left join by_day on by_day.day = series.day::date
    ),
    pages as (
      select page, count(*) as visits from data where event_type = 'page_view' group by page
      order by visits desc, page limit 14
    ),
    shows as (
      select series_id, max(series_title) as title,
        count(*) filter (where event_type = 'series_view') as views,
        count(*) filter (where event_type = 'play_start') as plays,
        count(*) filter (where event_type = 'play_complete') as completions
      from data where series_id is not null and event_type in ('series_view','play_start','play_complete')
      group by series_id order by plays desc, views desc, series_id limit 12
    ),
    ads as (
      select ad_id, count(*) filter (where event_type = 'ad_impression') as impressions,
        count(*) filter (where event_type = 'ad_click') as clicks
      from data where ad_id is not null and event_type in ('ad_impression','ad_click')
      group by ad_id order by impressions desc, ad_id
    )
    select jsonb_build_object(
      'totals', (select to_jsonb(totals) from totals),
      'daily', (select jsonb_agg(to_jsonb(calendar) order by day) from calendar),
      'pages', coalesce((select jsonb_agg(to_jsonb(pages) order by visits desc,page) from pages), '[]'::jsonb),
      'series', coalesce((select jsonb_agg(to_jsonb(shows) order by plays desc,views desc,series_id) from shows), '[]'::jsonb),
      'ads', coalesce((select jsonb_agg(to_jsonb(ads) order by impressions desc,ad_id) from ads), '[]'::jsonb)
    )
  );
end;
$$;
