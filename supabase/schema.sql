-- MadePick database migration v1
-- Run this entire file ONCE in Supabase SQL Editor as the project owner.
-- Browser uses only the Supabase publishable/anon key. RLS is mandatory.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'MadePick 사용자' check (char_length(display_name) between 2 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 3 and 120),
  description text not null check (char_length(trim(description)) between 10 and 4000),
  category text not null default 'other' check (category in ('ai','productivity','finance','game','education','other')),
  status text not null default 'open' check (status in ('open','building','completed')),
  visibility text not null default 'published' check (visibility in ('published','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  request_id uuid references public.requests(id) on delete set null,
  title text not null check (char_length(trim(title)) between 2 and 120),
  description text not null check (char_length(trim(description)) between 10 and 4000),
  category text not null default 'other' check (category in ('ai','productivity','finance','game','education','other')),
  url text not null check (char_length(url) < 2000 and url ~* '^https://[^[:space:]/]+'),
  visibility text not null default 'published' check (visibility in ('published','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.build_participations (
  request_id uuid not null references public.requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'building' check (status in ('building','completed')),
  created_at timestamptz not null default now(),
  primary key (request_id, user_id)
);

create table if not exists public.request_votes (
  request_id uuid not null references public.requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (request_id, user_id)
);

create table if not exists public.product_votes (
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value smallint not null check (value in (-1,1)),
  created_at timestamptz not null default now(),
  primary key (product_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  request_id uuid references public.requests(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 2 and 1500),
  kind text not null default 'discussion' check (kind in ('discussion','progress')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint one_comment_target check ((request_id is not null)::int + (product_id is not null)::int = 1)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(trim(body)) between 5 and 1500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, author_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_kind text not null check (target_kind in ('request','product','comment','review')),
  target_id uuid not null,
  reason text not null check (char_length(trim(reason)) between 5 and 500),
  created_at timestamptz not null default now(),
  unique(reporter_id,target_kind,target_id)
);

-- Only database owners (not browser users) can add moderator membership.
create table if not exists public.moderators (
  user_id uuid primary key references public.profiles(id) on delete cascade
);
create or replace function public.is_moderator()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.moderators where user_id = (select auth.uid())) $$;
revoke all on function public.is_moderator() from public;
grant execute on function public.is_moderator() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path=''
as $$ begin new.updated_at=now();return new;end $$;
drop trigger if exists touch_profiles on public.profiles;
create trigger touch_profiles before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists touch_requests on public.requests;
create trigger touch_requests before update on public.requests for each row execute function public.touch_updated_at();
drop trigger if exists touch_products on public.products;
create trigger touch_products before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists touch_comments on public.comments;
create trigger touch_comments before update on public.comments for each row execute function public.touch_updated_at();
drop trigger if exists touch_reviews on public.reviews;
create trigger touch_reviews before update on public.reviews for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'),''), 'MadePick 사용자'),40)
  ) on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Harden content visibility: authors may not re-publish admin-hidden content.
create or replace function public.protect_visibility()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  if old.visibility = 'hidden' and new.visibility = 'published'
     and not public.is_moderator() then
     raise exception 'Content was hidden by moderation';
  end if;
  if new.visibility <> old.visibility and not public.is_moderator() then
     raise exception 'Only moderators can change visibility';
  end if;
  return new;
end; $$;
drop trigger if exists protect_request_visibility on public.requests;
create trigger protect_request_visibility before update on public.requests for each row execute function public.protect_visibility();
drop trigger if exists protect_product_visibility on public.products;
create trigger protect_product_visibility before update on public.products for each row execute function public.protect_visibility();

alter table public.profiles enable row level security;
alter table public.requests enable row level security;
alter table public.products enable row level security;
alter table public.build_participations enable row level security;
alter table public.request_votes enable row level security;
alter table public.product_votes enable row level security;
alter table public.comments enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.moderators enable row level security;

create policy "profiles public read" on public.profiles for select to anon,authenticated using (true);
create policy "profiles owner edit" on public.profiles for update to authenticated
  using (id=(select auth.uid())) with check (id=(select auth.uid()));

create policy "requests public read" on public.requests for select to anon,authenticated
  using (visibility='published' or owner_id=(select auth.uid()) or public.is_moderator());
create policy "requests owner insert" on public.requests for insert to authenticated
  with check (owner_id=(select auth.uid()) and visibility='published');
create policy "requests owner edit" on public.requests for update to authenticated
  using (owner_id=(select auth.uid()) or public.is_moderator())
  with check (owner_id=(select auth.uid()) or public.is_moderator());
create policy "requests owner delete" on public.requests for delete to authenticated
  using (owner_id=(select auth.uid()) or public.is_moderator());

create policy "products public read" on public.products for select to anon,authenticated
  using (visibility='published' or owner_id=(select auth.uid()) or public.is_moderator());
create policy "products owner insert" on public.products for insert to authenticated
  with check (owner_id=(select auth.uid()) and visibility='published' and
    (request_id is null or exists(
      select 1 from public.requests req where req.id=request_id and
      (req.owner_id=(select auth.uid()) or exists(
        select 1 from public.build_participations b
        where b.request_id=req.id and b.user_id=(select auth.uid())
      ))
    )));
create policy "products owner edit" on public.products for update to authenticated
  using (owner_id=(select auth.uid()) or public.is_moderator())
  with check (public.is_moderator() or (
    owner_id=(select auth.uid()) and
    (request_id is null or exists(
      select 1 from public.requests req where req.id=request_id and
      (req.owner_id=(select auth.uid()) or exists(
        select 1 from public.build_participations b
        where b.request_id=req.id and b.user_id=(select auth.uid())
      ))
    ))
  ));
create policy "products owner delete" on public.products for delete to authenticated
  using (owner_id=(select auth.uid()) or public.is_moderator());

create policy "participations public read" on public.build_participations for select to anon,authenticated using (true);
create policy "participations own insert" on public.build_participations for insert to authenticated
  with check(user_id=(select auth.uid()));
create policy "participations own update" on public.build_participations for update to authenticated
  using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "participations own delete" on public.build_participations for delete to authenticated
  using(user_id=(select auth.uid()));

create policy "request votes public read" on public.request_votes for select to anon,authenticated using(true);
create policy "request votes own insert" on public.request_votes for insert to authenticated
  with check(user_id=(select auth.uid()));
create policy "request votes own delete" on public.request_votes for delete to authenticated
  using(user_id=(select auth.uid()));

create policy "product votes public read" on public.product_votes for select to anon,authenticated using(true);
create policy "product votes own insert" on public.product_votes for insert to authenticated
  with check(user_id=(select auth.uid()));
create policy "product votes own update" on public.product_votes for update to authenticated
  using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "product votes own delete" on public.product_votes for delete to authenticated
  using(user_id=(select auth.uid()));

create policy "comments public read" on public.comments for select to anon,authenticated using(true);
create policy "comments own insert" on public.comments for insert to authenticated
  with check(author_id=(select auth.uid()) and
    (kind='discussion' or (request_id is not null and exists
      (select 1 from public.build_participations b where b.request_id=comments.request_id and b.user_id=(select auth.uid())))));
create policy "comments own update" on public.comments for update to authenticated
  using(author_id=(select auth.uid()) or public.is_moderator())
  with check(author_id=(select auth.uid()) or public.is_moderator());
create policy "comments own delete" on public.comments for delete to authenticated
  using(author_id=(select auth.uid()) or public.is_moderator());

create policy "reviews public read" on public.reviews for select to anon,authenticated using(true);
create policy "reviews own insert, not own product" on public.reviews for insert to authenticated
  with check(author_id=(select auth.uid()) and exists
    (select 1 from public.products p where p.id=product_id and p.owner_id <> (select auth.uid())));
create policy "reviews own update" on public.reviews for update to authenticated
  using(author_id=(select auth.uid()) or public.is_moderator())
  with check((author_id=(select auth.uid()) and exists
    (select 1 from public.products p where p.id=product_id and p.owner_id<>(select auth.uid())))
    or public.is_moderator());
create policy "reviews own delete" on public.reviews for delete to authenticated
  using(author_id=(select auth.uid()) or public.is_moderator());

create policy "reports own submit" on public.reports for insert to authenticated
  with check(reporter_id=(select auth.uid()));
create policy "reports owner or moderator read" on public.reports for select to authenticated
  using(reporter_id=(select auth.uid()) or public.is_moderator());
create policy "reports moderator delete" on public.reports for delete to authenticated
  using(public.is_moderator());

create policy "moderator own membership read" on public.moderators for select to authenticated
  using(user_id=(select auth.uid()));
-- Intentionally no browser INSERT/UPDATE/DELETE policy for moderators.

create index if not exists requests_latest on public.requests (created_at desc);
create index if not exists products_latest on public.products (created_at desc);
create index if not exists request_votes_created on public.request_votes(created_at desc);
create index if not exists product_votes_created on public.product_votes(created_at desc);
create index if not exists comments_request_latest on public.comments(request_id,created_at desc);
create index if not exists comments_product_latest on public.comments(product_id,created_at desc);
create index if not exists reviews_product_latest on public.reviews(product_id,created_at desc);

-- All ranking values come from real votes, not fabricated counter columns.
-- security_invoker ensures the underlying RLS policies are respected.
create or replace view public.request_metrics with (security_invoker=true) as
select r.id as request_id,
 count(v.user_id)::integer as total,
 count(v.user_id) filter (where v.created_at >= now()-interval '1 day')::integer as day,
 count(v.user_id) filter (where v.created_at >= now()-interval '7 days')::integer as week,
 count(v.user_id) filter (where v.created_at >= now()-interval '30 days')::integer as month
from public.requests r left join public.request_votes v on v.request_id=r.id
where r.visibility='published'
group by r.id;

create or replace view public.product_metrics with (security_invoker=true) as
select p.id as product_id,
 coalesce(v.total,0)::integer as total,
 coalesce(v.day,0)::integer as day,
 coalesce(v.week,0)::integer as week,
 coalesce(v.month,0)::integer as month,
 coalesce(rv.review_count,0)::integer as review_count,
 coalesce(rv.rating,0)::numeric(3,1) as rating
from public.products p
left join lateral (
  select sum(value) total,
    sum(value) filter(where created_at >= now()-interval '1 day') day,
    sum(value) filter(where created_at >= now()-interval '7 days') week,
    sum(value) filter(where created_at >= now()-interval '30 days') month
  from public.product_votes where product_id=p.id
) v on true
left join lateral (
  select count(*) review_count, round(avg(rating)::numeric,1) rating
  from public.reviews where product_id=p.id
) rv on true
where p.visibility='published';

grant select on public.request_metrics, public.product_metrics to anon,authenticated;
grant usage on schema public to anon,authenticated;
-- Supabase commonly grants table permissions on public schema by default.
-- These explicit grants make the migration portable:
grant select on public.profiles,public.requests,public.products,public.build_participations,
  public.request_votes,public.product_votes,public.comments,public.reviews to anon,authenticated;
grant select,insert,update,delete on public.profiles,public.requests,public.products,
  public.build_participations,public.request_votes,public.product_votes,
  public.comments,public.reviews to authenticated;
grant select,insert on public.reports to authenticated;
grant select on public.moderators to authenticated;


-- Simple baseline abuse protection. Also add CAPTCHA/server rate limiting before broad launch.
create or replace function public.guard_post_frequency()
returns trigger language plpgsql security definer set search_path=''
as $
declare n integer := 0;
begin
  if tg_table_name='requests' then
    select count(*) into n from public.requests
    where owner_id=new.owner_id and created_at>now()-interval '1 hour';
    if n>=8 then raise exception 'Request posting limit exceeded'; end if;
  elsif tg_table_name='products' then
    select count(*) into n from public.products
    where owner_id=new.owner_id and created_at>now()-interval '1 hour';
    if n>=8 then raise exception 'Product posting limit exceeded'; end if;
  elsif tg_table_name='comments' then
    select count(*) into n from public.comments
    where author_id=new.author_id and created_at>now()-interval '1 hour';
    if n>=35 then raise exception 'Comment posting limit exceeded'; end if;
  elsif tg_table_name='reviews' then
    select count(*) into n from public.reviews
    where author_id=new.author_id and created_at>now()-interval '1 hour';
    if n>=12 then raise exception 'Review posting limit exceeded'; end if;
  elsif tg_table_name='reports' then
    select count(*) into n from public.reports
    where reporter_id=new.reporter_id and created_at>now()-interval '1 day';
    if n>=20 then raise exception 'Report limit exceeded'; end if;
  end if;
  return new;
end $;

drop trigger if exists limit_request_creation on public.requests;
create trigger limit_request_creation before insert on public.requests
for each row execute function public.guard_post_frequency();

drop trigger if exists limit_product_creation on public.products;
create trigger limit_product_creation before insert on public.products
for each row execute function public.guard_post_frequency();

drop trigger if exists limit_comment_creation on public.comments;
create trigger limit_comment_creation before insert on public.comments
for each row execute function public.guard_post_frequency();

drop trigger if exists limit_review_creation on public.reviews;
create trigger limit_review_creation before insert on public.reviews
for each row execute function public.guard_post_frequency();

drop trigger if exists limit_report_creation on public.reports;
create trigger limit_report_creation before insert on public.reports
for each row execute function public.guard_post_frequency();

-- Optional manual moderator assignment AFTER a Google sign-in:
-- insert into public.moderators(user_id) values ('<auth user uuid>');
