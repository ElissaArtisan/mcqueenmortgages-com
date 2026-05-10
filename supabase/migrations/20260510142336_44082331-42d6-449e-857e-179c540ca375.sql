
create table public.pre_approval_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- applicant
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  city_province text,
  date_of_birth date,
  employment_status text not null,
  employer_name text,
  job_title text,
  annual_income text not null,
  additional_income text,
  -- property
  purchase_price text,
  down_payment text,
  property_type text,
  timeline text,
  first_time_buyer text,
  current_payment text,
  credit_score text,
  -- co-applicant
  has_co_applicant boolean not null default false,
  co_first_name text,
  co_last_name text,
  co_email text,
  co_phone text,
  co_date_of_birth date,
  co_employment_status text,
  co_employer_name text,
  co_job_title text,
  co_annual_income text,
  co_additional_income text,
  co_credit_score text,
  -- misc
  notes text,
  consent boolean not null default false
);

alter table public.pre_approval_leads enable row level security;

-- Public can submit, no one can read/update/delete via the API
create policy "Anyone can submit a pre-approval lead"
on public.pre_approval_leads
for insert
to anon, authenticated
with check (consent = true);
