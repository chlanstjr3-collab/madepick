# MadePick — Database and moderation handbook

## Current data model

profiles: Google-authenticated users and public display names.
requests: requested apps/tools and request status.
products: showcased completed products and optional linked request.
build_participations: one voluntary maker participation per request.
request_votes: one need-this vote per user per request.
product_votes: one signed up/down vote per user per product.
comments: separate request/product discussions; maker progress notes are request comments of kind progress.
reviews: one star rating + review per user per product; cannot review own product.
reports: user submissions about inappropriate products/requests/comments/reviews.
moderators: special membership table, not directly writable through the browser.

All tables have row-level access restrictions defined in supabase/schema.sql.

## Manually designate a moderator

In Supabase SQL Editor (run as project owner), replace UUID with the intended signed-in Google user's auth.users ID:

    insert into public.moderators(user_id)
    values ('00000000-0000-0000-0000-000000000000')
    on conflict do nothing;

Never expose moderator-management credentials or a Supabase secret key in the frontend.

## Review incoming reports

Run in the Supabase SQL Editor:

    select id, target_kind, target_id, reason, created_at, reporter_id
    from public.reports
    order by created_at desc limit 100;

Investigate reports before taking action. Preserve an appeal/contact process.

## Hide a problematic request or product

Run as a project owner in Supabase SQL Editor, using an actual UUID:

    update public.requests
    set visibility = 'hidden'
    where id = '00000000-0000-0000-0000-000000000000';

    update public.products
    set visibility = 'hidden'
    where id = '00000000-0000-0000-0000-000000000000';

Original authors cannot unhide moderator-hidden items through standard browser access. Do not delete a user's content without applying a clear policy. Comments and reviews currently use direct deletion by authorized authors/moderators; a future admin dashboard should expose moderation actions safely.

## Known beta restrictions

- No bot challenge/CAPTCHA or reliable server-side abuse-rate limits yet. The schema enforces one vote per user per item, one review per user per product, and unique reports.
- No admin dashboard for report queue management; review via Supabase owner dashboard until implemented.
- No NSFW/malware link scanning; visitors should take care with external links.
- No verified-use proof for review submissions; writing a review requires checking a self-attestation box. Do not advertise them as verified purchases or independently verified use.
- Public profile display name is visible. Google email stays in auth.users and is not publicly presented as part of the profiles table.
- Follow local privacy/consumer and platform rules before inviting users, especially international visitors.

## Production follow-up

Add CAPTCHA, server-side rate limiting, email/contact address, privacy policy, terms, reporting and takedown workflows, incident logs, accessible administration UI, paginated reads, dynamic detail page SEO and audit of RLS policies.
