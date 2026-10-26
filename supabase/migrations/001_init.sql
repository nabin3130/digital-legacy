-- Contact inquiries for LOGOUT.
-- Company policy text stays in lib/data.ts and lib/company-en.ts.
-- Guide progress, account data, and identity documents are not stored here.
--
-- Apply once in the Supabase SQL editor (or via the Supabase CLI).
-- Re-running is safe: the unused companies draft is removed, then the
-- contact table and submit_contact function are created or replaced.
--
-- Anonymous clients can execute submit_contact only. They cannot read,
-- update, or delete rows. Review and delete inquiries from the dashboard
-- within 30 days of answering, as described in the privacy policy.

drop table if exists public.companies;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint contact_submissions_locale_check check (locale in ('ko', 'en')),
  constraint contact_submissions_email_check check (
    char_length(email) between 3 and 320
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint contact_submissions_message_check check (char_length(message) between 1 and 4000)
);

comment on table public.contact_submissions is
  'Contact form email and message only. No guide progress, account data, or identity documents.';

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

create index if not exists contact_submissions_email_created_at_idx
  on public.contact_submissions (lower(email), created_at desc);

alter table public.contact_submissions enable row level security;

revoke all on table public.contact_submissions from PUBLIC, anon, authenticated;
grant select, insert, update, delete on table public.contact_submissions to service_role;

create or replace function public.submit_contact(
  p_locale text,
  p_email text,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text;
  normalized_message text;
  recent_from_email integer;
  recent_total integer;
begin
  if p_locale is null or p_locale not in ('ko', 'en') then
    raise exception 'invalid_locale' using errcode = '22023';
  end if;

  normalized_email := trim(coalesce(p_email, ''));
  normalized_message := trim(coalesce(p_message, ''));

  if char_length(normalized_email) < 3
     or char_length(normalized_email) > 320
     or normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  if char_length(normalized_message) < 1 or char_length(normalized_message) > 4000 then
    raise exception 'invalid_message' using errcode = '22023';
  end if;

  select count(*) into recent_from_email
  from public.contact_submissions
  where lower(email) = lower(normalized_email)
    and created_at > now() - interval '1 hour';

  if recent_from_email >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  select count(*) into recent_total
  from public.contact_submissions
  where created_at > now() - interval '1 hour';

  if recent_total >= 30 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.contact_submissions (locale, email, message)
  values (p_locale, normalized_email, normalized_message);
end;
$$;

comment on function public.submit_contact(text, text, text) is
  'Validates and stores a contact inquiry. Anonymous callers cannot read the table.';

revoke all on function public.submit_contact(text, text, text) from PUBLIC;
grant execute on function public.submit_contact(text, text, text) to anon, authenticated, service_role;
