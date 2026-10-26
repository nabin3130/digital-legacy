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
## SEO and share previews

Canonical URLs, Open Graph, Twitter cards, `sitemap.xml`, and `robots.txt` all use one public origin:

- `NEXT_PUBLIC_SITE_URL` — origin only, no trailing slash. Example: `https://digital-legacy-five.vercel.app`
- If the variable is unset, the app falls back to `https://digital-legacy-five.vercel.app`.

Set it in the Vercel project for Production. Use the same production origin for Preview when preview deployments should not advertise themselves as the canonical site. Do not set it to a `*.vercel.app` preview URL.

Connecting a custom domain is separate from this setup. When a domain is live, change `NEXT_PUBLIC_SITE_URL` to that origin so canonical and share URLs follow it.

The share image is `public/og/logout-share.png` (1200×630). Regenerate it with `python3 scripts/generate-og-image.py` after installing Pillow and the fonts noted in that script. Open Graph and Twitter image tags use an absolute URL on the site origin.

## Repository guides (한국어)

`/guides` lists published guides. `/guides/[slug]` renders Markdown and FAQ as static server HTML, with a table of contents, related guides and a `/#start` CTA. No CMS or external blog connection is used.

### Add or update a guide

1. Copy `docs/guide-template.md` to `content/guides/your-lowercase-slug.md`.
2. Fill in YAML frontmatter: `title`, `description`, `date` (quoted `YYYY-MM-DD`); optional `updated`, `tags` (string array), `draft` (boolean), `faq` (array of `{ question, answer }`). Dates must be real calendar dates; `updated` cannot precede `date`.
3. Start the body with a direct-answer paragraph of 2–4 sentences. Use `##` / `###` headings; the page supplies the only H1. Use standard Markdown links and lists, with a sources section and explicit conditions. Raw HTML and executable MDX are not supported.
4. FAQ frontmatter renders the visible FAQ and the matching FAQPage data automatically. Do not duplicate that FAQ in the body. Long posts (at least three H2/H3 headings) get a table of contents.
5. Keep `draft: true` while writing. Drafts are excluded in **all environments**, including direct detail URLs (404), related guides, sitemap, llms.txt and JSON-LD. There is no public draft preview. Set `draft: false` or omit it to publish; commit and rebuild.
6. Run `npm ci`, `npm run test:guides`, `npx tsc --noEmit`, and `NEXT_PUBLIC_SITE_URL=https://logout.nabin.cc npm run build`. Local test runner requires Node 22.18+ or 24+; the Next.js app keeps its existing runtime requirements.

For production HTML verification, run `NEXT_PUBLIC_SITE_URL=https://logout.nabin.cc npm run start -- --port 3091`, then `NEXT_PUBLIC_SITE_URL=https://logout.nabin.cc node scripts/check-guides.mjs http://localhost:3091`. The checks cover metadata, visible summary/FAQ, JSON-LD, sitemap, llms.txt, robots and unknown/draft 404s. A temporary `qa-draft.md` copied from the template was included during the verified build and removed afterward.

The canonical production origin is `NEXT_PUBLIC_SITE_URL=https://logout.nabin.cc` (already configured on Vercel). Set it locally for build/start checks too. Existing `lib/site.ts` origin resolution remains unchanged; guides reuse `lib/seo.ts`, and `app/robots.ts` already allows crawling and points to the shared sitemap.

`lib/guide-seo.ts` emits one page-level JSON-LD graph: WebPage/FAQPage, BlogPosting and BreadcrumbList (CollectionPage and ItemList on the index). It references the existing Organization/WebSite graph in the root layout; it adds no SearchAction or speculative HowTo schema. Structured FAQ content is the same text shown to readers. Search-engine display, citation, and rich results are not guaranteed.

`app/llms.txt/route.ts` serves `/llms.txt`, using SITE_URL and only published guide URLs. `app/sitemap.ts` adds the index and published details with `updated ?? date` lastmod. Publishing dates describe the article, not a re-verification of every company policy.

Sample slugs:

- `before-managing-a-deceased-account`
- `download-delete-memorial-differences`
- `how-to-read-official-account-guidance`

TODO: translate guides and add `/en/guides` parity. Until then, English navigation labels these links as Korean; switching language from a guide goes to `/en` rather than a missing translation. No fictitious English hreflang URLs are emitted.

This feature adds no AdSense scripts, ad slots or ads.txt. The pre-existing global advertising script in `app/layout.tsx` is outside this change.

## Roadmap

- [x] Supabase clients and contact inquiry storage
- [ ] Admin dashboard for managing policy data
- [ ] Expand support for additional online services
- [ ] Keep official policy links and application procedures up to date
