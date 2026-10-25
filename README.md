# Digital Legacy

<img width="1425" height="759" alt="digital-navigator" src="https://github.com/user-attachments/assets/5b525045-29d0-4d6a-adde-98cb9d199cf8" />

A web platform that simplifies digital account inheritance by providing clear guidance on account policies and procedures, starting with major online services in Korea.

## Features

- Browse digital legacy policies by company
- Compare account inheritance and deletion procedures
- Search services and terminology
- Interactive checklists to guide users through the process
- Mobile-friendly interface

## Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase
- Vercel

## Live Demo

https://digital-legacy-five.vercel.app/

## Supabase

Company guides stay in `lib/data.ts` and `lib/company-en.ts`. Checklist and guide progress stay in the browser. Supabase stores contact-form inquiries only, and only after the variables below are set. It does not store account data or identity documents.

### Environment variables

Copy `.env.example` to `.env.local` for local development. On Vercel, add the same names under Project Settings → Environment Variables, then redeploy.

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For inquiry storage | Project URL from Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For inquiry storage | `anon` public key. A publishable key (`sb_publishable_...`) also works here, or as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Inbox for FormSubmit email delivery. Blank uses the address published on the privacy policy |

Do not add the service role key or secret key to Vercel or to any `NEXT_PUBLIC_` variable.

The site builds and the contact form still sends email when the Supabase URL or key is missing. `createClient()` and `createServerSupabaseClient()` throw an error that names the missing variables, so a feature that calls them directly fails clearly instead of sending an anonymous request.

### Database

Run `supabase/migrations/001_init.sql` once in the Supabase SQL editor. The script removes the unused `companies` draft, creates `contact_submissions`, and exposes `submit_contact` to anonymous visitors. Row level security stays on, with no public read, update, or delete.

Read new rows in the Supabase table editor. Delete them within 30 days of the reply. This repo does not schedule that deletion.

There is no signed-in user and no auth middleware. The server client still uses the App Router cookie adapter. Nothing in the product writes a user session today.

Browser client: `lib/supabase.ts` (`createClient`, client components only). Server client: `lib/supabase-server.ts` (`createServerSupabaseClient`).

## Roadmap

- [x] Supabase clients and contact inquiry storage
- [ ] Admin dashboard for managing policy data
- [ ] Expand support for additional online services
- [ ] Keep official policy links and application procedures up to date
