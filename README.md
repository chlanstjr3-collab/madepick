# MadePick · 메이드픽

**요청하고 · 만들어주고 · 전시하고**  
Request it · Build it · Show it

**Site:** https://chlanstjr3-collab.github.io/madepick/

MadePick is a Korean/English community for requesting useful digital products, voluntarily building them, and showcasing completed websites/apps. The current public build contains **no fake listings, no fake makers, and no fabricated votes**.

## Features implemented in the source

- Google OAuth login via Supabase, public viewing, user profile and display-name edit
- Requests with upvotes, comments and status (requested/building/completed)
- Volunteer maker participation and progress updates in request discussion
- Product submissions with HTTPS outbound links, promotional tagline, detailed introduction and features, and optional association with a requested idea
- Up to five screenshots/photos per product, with the first image used as the cover; authenticated owner-only uploads/removals via Supabase Storage
- Product upvotes/downvotes, 1-5 star reviews and regular comments
- Edit/delete your own items, report problematic posts
- Search and filtering, daily/weekly/monthly/all-time vote-based rankings
- Korean/English interface, responsive mobile/desktop UI
- Supabase SQL migration including RLS and moderator role table
- Automated GitHub Pages deployment with JavaScript syntax and smoke checks

## What is not yet activated

A Supabase project needs to be connected before Google login, shared multi-user data, and image uploads can work. The connection keys in config.js are intentionally blank. Google OAuth must be enabled and the SQL migration applied to your own Supabase project. **The site is publicly deployed, but its real account/data features are not yet operational.**

**Setup instructions:** [SETUP.md](./SETUP.md)  
**Database migration:** [supabase/schema.sql](./supabase/schema.sql)  
**Moderation:** [DATABASE_AND_MODERATION.md](./DATABASE_AND_MODERATION.md)

## How it's hosted

The deployable frontend is plain browser HTML/CSS/JavaScript in the repository root. GitHub Actions publishes it to GitHub Pages without Codespaces or a build environment. Supabase provides identity, PostgreSQL data and Row Level Security after connection.

**SEO limitation:** This deployment is a client-side SPA, not a Next.js server-rendered site. Individual request/product URLs use hash routing and are not optimized for search indexing. For production search acquisition, migrate detail pages to server-rendered URLs when the database is connected.

## What to validate after connecting Supabase

Two-account end-to-end sign-in, request creation, voting, joining builds, comments, reviews, reports, and ownership permissions. Content moderation process, rate-limiting/CAPTCHA, privacy policy, terms, operator contact and SEO must be addressed before a public user-acquisition launch.

No secrets or service_role key should ever be committed to this repository.
