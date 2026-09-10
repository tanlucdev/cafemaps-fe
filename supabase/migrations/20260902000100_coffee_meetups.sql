create extension if not exists pgcrypto;

create table if not exists public.coffee_meetups (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  cafe_slug text not null references public.cafes(slug) on delete restrict,
  cafe_name text not null,
  cafe_district text,
  cafe_address text,
  organizer_id text not null,
  organizer_name text not null,
  purpose text not null check (purpose in ('Học tập', 'Làm việc', 'Luyện ngoại ngữ', 'Đọc sách', 'Gặp bạn mới', 'Trò chuyện', 'Khác')),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  max_participants integer not null check (max_participants between 2 and 10),
  status text not null default 'open' check (status in ('open', 'full', 'cancelled', 'completed')),
  accepted_participant_names text[] not null default '{}'::text[],
  accepted_count integer not null default 1 check (accepted_count >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (accepted_count <= max_participants)
);

create index if not exists coffee_meetups_status_starts_idx on public.coffee_meetups (status, starts_at);
create index if not exists coffee_meetups_cafe_idx on public.coffee_meetups (cafe_slug, starts_at);
create index if not exists coffee_meetups_organizer_idx on public.coffee_meetups (organizer_id, starts_at desc);

create table if not exists public.coffee_meetup_requests (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid not null references public.coffee_meetups(id) on delete cascade,
  requester_id text not null,
  requester_name text not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meetup_id, requester_id)
);

create index if not exists coffee_meetup_requests_meetup_status_idx on public.coffee_meetup_requests (meetup_id, status);
create index if not exists coffee_meetup_requests_requester_idx on public.coffee_meetup_requests (requester_id, status);

create table if not exists public.coffee_meetup_reports (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid not null references public.coffee_meetups(id) on delete cascade,
  reporter_id text not null,
  reporter_name text not null,
  reason text not null check (reason in ('Spam', 'Nội dung không phù hợp', 'Quấy rối', 'Thông tin sai', 'Khác')),
  note text,
  created_at timestamptz not null default now(),
  unique (meetup_id, reporter_id)
);

create index if not exists coffee_meetup_reports_meetup_idx on public.coffee_meetup_reports (meetup_id, created_at desc);

alter table public.coffee_meetups enable row level security;
alter table public.coffee_meetup_requests enable row level security;
alter table public.coffee_meetup_reports enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetups' and policyname = 'public can read meetups') then
    create policy "public can read meetups" on public.coffee_meetups for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetups' and policyname = 'organizer can manage meetups') then
    create policy "organizer can manage meetups" on public.coffee_meetups
      for update using (organizer_id = auth.uid()::text) with check (organizer_id = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetups' and policyname = 'authenticated can create meetups') then
    create policy "authenticated can create meetups" on public.coffee_meetups
      for insert with check (organizer_id = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetups' and policyname = 'organizer can delete meetups') then
    create policy "organizer can delete meetups" on public.coffee_meetups
      for delete using (organizer_id = auth.uid()::text);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetup_requests' and policyname = 'requester or organizer can read requests') then
    create policy "requester or organizer can read requests" on public.coffee_meetup_requests
      for select using (
        requester_id = auth.uid()::text
        or exists (
          select 1 from public.coffee_meetups m
          where m.id = coffee_meetup_requests.meetup_id and m.organizer_id = auth.uid()::text
        )
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetup_requests' and policyname = 'authenticated can create requests') then
    create policy "authenticated can create requests" on public.coffee_meetup_requests
      for insert with check (requester_id = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetup_requests' and policyname = 'requester or organizer can update requests') then
    create policy "requester or organizer can update requests" on public.coffee_meetup_requests
      for update using (
        requester_id = auth.uid()::text
        or exists (
          select 1 from public.coffee_meetups m
          where m.id = coffee_meetup_requests.meetup_id and m.organizer_id = auth.uid()::text
        )
      ) with check (
        requester_id = auth.uid()::text
        or exists (
          select 1 from public.coffee_meetups m
          where m.id = coffee_meetup_requests.meetup_id and m.organizer_id = auth.uid()::text
        )
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetup_reports' and policyname = 'reporter or organizer can read reports') then
    create policy "reporter or organizer can read reports" on public.coffee_meetup_reports
      for select using (
        reporter_id = auth.uid()::text
        or exists (
          select 1 from public.coffee_meetups m
          where m.id = coffee_meetup_reports.meetup_id and m.organizer_id = auth.uid()::text
        )
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'coffee_meetup_reports' and policyname = 'authenticated can create reports') then
    create policy "authenticated can create reports" on public.coffee_meetup_reports
      for insert with check (reporter_id = auth.uid()::text);
  end if;
end $$;

create or replace function public.coffee_meetup_accept_request(request_id uuid, organizer_id text)
returns public.coffee_meetups
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
declare
  meetup_row public.coffee_meetups;
  request_row public.coffee_meetup_requests;
begin
  select * into request_row from public.coffee_meetup_requests where id = request_id for update;
  if not found then
    raise exception 'request_not_found';
  end if;
  if request_row.status <> 'pending' then
    raise exception 'request_not_pending';
  end if;

  select * into meetup_row from public.coffee_meetups where id = request_row.meetup_id for update;
  if not found then
    raise exception 'meetup_not_found';
  end if;
  if meetup_row.organizer_id <> organizer_id then
    raise exception 'forbidden';
  end if;
  if meetup_row.status <> 'open' then
    raise exception 'meetup_not_open';
  end if;
  if meetup_row.accepted_count >= meetup_row.max_participants then
    update public.coffee_meetups set status = 'full', updated_at = now() where id = meetup_row.id;
    raise exception 'meetup_full';
  end if;

  update public.coffee_meetup_requests
  set status = 'accepted', updated_at = now()
  where id = request_id;

  update public.coffee_meetups
  set
    accepted_participant_names = array_append(coalesce(accepted_participant_names, '{}'::text[]), request_row.requester_name),
    accepted_count = accepted_count + 1,
    status = case when accepted_count + 1 >= max_participants then 'full' else 'open' end,
    updated_at = now()
  where id = meetup_row.id
  returning * into meetup_row;

  return meetup_row;
end;
$$;

create or replace function public.coffee_meetup_create(
  cafe_id text,
  cafe_slug text,
  cafe_name text,
  cafe_district text,
  cafe_address text,
  organizer_id text,
  organizer_name text,
  purpose text,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  max_participants integer
)
returns public.coffee_meetups
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
declare
  meetup_row public.coffee_meetups;
begin
  if starts_at <= now() then raise exception 'starts_at_in_past'; end if;
  if ends_at <= starts_at then raise exception 'ends_before_start'; end if;
  if max_participants < 2 or max_participants > 10 then raise exception 'bad_capacity'; end if;

  insert into public.coffee_meetups (
    cafe_id, cafe_slug, cafe_name, cafe_district, cafe_address,
    organizer_id, organizer_name, purpose, title, description,
    starts_at, ends_at, max_participants
  )
  values (
    cafe_id, cafe_slug, cafe_name, cafe_district, cafe_address,
    organizer_id, organizer_name, purpose, title, nullif(description, ''),
    starts_at, ends_at, max_participants
  )
  returning * into meetup_row;
  return meetup_row;
end;
$$;

create or replace function public.coffee_meetup_update(
  meetup_id uuid,
  organizer_id text,
  cafe_id text,
  cafe_slug text,
  cafe_name text,
  cafe_district text,
  cafe_address text,
  purpose text,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  max_participants integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
begin
  if starts_at <= now() then raise exception 'starts_at_in_past'; end if;
  if ends_at <= starts_at then raise exception 'ends_before_start'; end if;
  if max_participants < 2 or max_participants > 10 then raise exception 'bad_capacity'; end if;

  update public.coffee_meetups
  set cafe_id = coffee_meetup_update.cafe_id,
      cafe_slug = coffee_meetup_update.cafe_slug,
      cafe_name = coffee_meetup_update.cafe_name,
      cafe_district = coffee_meetup_update.cafe_district,
      cafe_address = coffee_meetup_update.cafe_address,
      purpose = coffee_meetup_update.purpose,
      title = coffee_meetup_update.title,
      description = nullif(coffee_meetup_update.description, ''),
      starts_at = coffee_meetup_update.starts_at,
      ends_at = coffee_meetup_update.ends_at,
      max_participants = coffee_meetup_update.max_participants,
      status = case when accepted_count >= coffee_meetup_update.max_participants then 'full' else 'open' end,
      updated_at = now()
  where id = meetup_id and public.coffee_meetups.organizer_id = coffee_meetup_update.organizer_id;
  if not found then raise exception 'forbidden_or_not_found'; end if;
end;
$$;

create or replace function public.coffee_meetup_join_request(
  meetup_id uuid,
  requester_id text,
  requester_name text,
  message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
declare
  meetup_row public.coffee_meetups;
begin
  select * into meetup_row from public.coffee_meetups where id = meetup_id for update;
  if not found then raise exception 'meetup_not_found'; end if;
  if meetup_row.organizer_id = requester_id then raise exception 'self_join'; end if;
  if meetup_row.status <> 'open' then raise exception 'meetup_not_open'; end if;
  if meetup_row.ends_at <= now() then raise exception 'meetup_ended'; end if;
  if meetup_row.accepted_count >= meetup_row.max_participants then raise exception 'meetup_full'; end if;

  insert into public.coffee_meetup_requests (meetup_id, requester_id, requester_name, message, status)
  values (meetup_id, requester_id, requester_name, nullif(message, ''), 'pending');
end;
$$;

create or replace function public.coffee_meetup_reject_request(request_id uuid, organizer_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
declare
  meetup_row public.coffee_meetups;
begin
  select m.* into meetup_row
  from public.coffee_meetup_requests r
  join public.coffee_meetups m on m.id = r.meetup_id
  where r.id = request_id
  for update;
  if not found then
    raise exception 'request_not_found';
  end if;
  if meetup_row.organizer_id <> organizer_id then
    raise exception 'forbidden';
  end if;

  update public.coffee_meetup_requests
  set status = 'rejected', updated_at = now()
  where id = request_id;
end;
$$;

create or replace function public.coffee_meetup_withdraw_request(request_id uuid, actor_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
begin
  update public.coffee_meetup_requests
  set status = 'withdrawn', updated_at = now()
  where id = request_id and public.coffee_meetup_requests.requester_id = actor_id and status = 'pending';
  if not found then
    raise exception 'request_not_found';
  end if;
end;
$$;

create or replace function public.coffee_meetup_cancel(meetup_id uuid, organizer_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
begin
  update public.coffee_meetups
  set status = 'cancelled', updated_at = now()
  where id = meetup_id and public.coffee_meetups.organizer_id = organizer_id;
  if not found then
    raise exception 'forbidden_or_not_found';
  end if;
end;
$$;

create or replace function public.coffee_meetup_complete(meetup_id uuid, organizer_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
begin
  update public.coffee_meetups
  set status = 'completed', updated_at = now()
  where id = meetup_id and public.coffee_meetups.organizer_id = organizer_id;
  if not found then
    raise exception 'forbidden_or_not_found';
  end if;
end;
$$;

create or replace function public.coffee_meetup_report(meetup_id uuid, reporter_id text, reporter_name text, reason text, note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_variable
begin
  insert into public.coffee_meetup_reports (meetup_id, reporter_id, reporter_name, reason, note)
  values (meetup_id, reporter_id, reporter_name, reason, note)
  on conflict (meetup_id, reporter_id) do update
  set reason = excluded.reason,
      note = excluded.note,
      created_at = now();
end;
$$;

create or replace function public.coffee_meetup_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists coffee_meetups_touch_updated_at on public.coffee_meetups;
create trigger coffee_meetups_touch_updated_at
before update on public.coffee_meetups
for each row execute function public.coffee_meetup_touch_updated_at();

drop trigger if exists coffee_meetup_requests_touch_updated_at on public.coffee_meetup_requests;
create trigger coffee_meetup_requests_touch_updated_at
before update on public.coffee_meetup_requests
for each row execute function public.coffee_meetup_touch_updated_at();
