create schema coconut_analytics;
revoke all on schema coconut_analytics from public, anon, authenticated;
grant usage on schema coconut_analytics to service_role;

create table coconut_analytics.owner_keys (
  key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$')
);
create table coconut_analytics.events (
  event_id uuid primary key,
  received_at timestamptz not null default now(),
  session_id uuid not null,
  event_type text not null check (event_type in ('page_view','series_view','play_start','play_complete','watch_time','ad_impression','ad_click')),
  page text not null check (page in ('home','browse','series','live','discover','rank','new','search','favorite','folders','history','settings','detail','player')),
  series_id text check (series_id ~ '^[0-9]{4,24}$'),
  series_title text check (char_length(series_title) <= 120),
  episode_id text check (episode_id ~ '^[0-9]{4,24}$'),
  ad_id text check (ad_id in ('advertise','local','sponsor')),
  seconds smallint check (seconds between 1 and 60)
);
create index coconut_events_received_idx on coconut_analytics.events (received_at);
alter table coconut_analytics.events enable row level security;
alter table coconut_analytics.owner_keys enable row level security;
revoke all on all tables in schema coconut_analytics from public, anon, authenticated;
grant insert, select on coconut_analytics.events to service_role;
grant select on coconut_analytics.owner_keys to service_role;

create function public.coconut_record_events(batch jsonb)
returns void language sql security invoker set search_path = '' as $$
  insert into coconut_analytics.events (event_id, session_id, event_type, page, series_id, series_title, episode_id, ad_id, seconds)
  select event_id, session_id, event_type, page, series_id, series_title, episode_id, ad_id, seconds
  from jsonb_to_recordset(batch) as input(event_id uuid, session_id uuid, event_type text, page text,
    series_id text, series_title text, episode_id text, ad_id text, seconds smallint)
  on conflict (event_id) do nothing;
$$;

create function public.coconut_stats_report(access_hash text, days integer)
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
      select day::date, coalesce(by_day.pageviews,0) as pageviews, coalesce(by_day.plays,0) as plays
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

revoke execute on function public.coconut_record_events(jsonb) from public, anon, authenticated;
revoke execute on function public.coconut_stats_report(text, integer) from public, anon, authenticated;
grant execute on function public.coconut_record_events(jsonb) to service_role;
grant execute on function public.coconut_stats_report(text, integer) to service_role;
