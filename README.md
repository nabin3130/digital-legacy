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

## SEO and share previews

Canonical URLs, Open Graph, Twitter cards, `sitemap.xml`, and `robots.txt` all use one public origin:

- `NEXT_PUBLIC_SITE_URL` — origin only, no trailing slash. Example: `https://digital-legacy-five.vercel.app`
- If the variable is unset, the app falls back to `https://digital-legacy-five.vercel.app`.

Set it in the Vercel project for Production. Use the same production origin for Preview when preview deployments should not advertise themselves as the canonical site. Do not set it to a `*.vercel.app` preview URL.

Connecting a custom domain is separate from this setup. When a domain is live, change `NEXT_PUBLIC_SITE_URL` to that origin so canonical and share URLs follow it.

The share image is `public/og/logout-share.png` (1200×630). Regenerate it with `python3 scripts/generate-og-image.py` after installing Pillow and the fonts noted in that script. Open Graph and Twitter image tags use an absolute URL on the site origin.

## Roadmap

- Complete Supabase integration
- Admin dashboard for managing policy data
- Expand support for additional online services
- Keep official policy links and application procedures up to date
