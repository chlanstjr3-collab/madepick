# MadePick · 메이드픽

**요청하고 · 만들어주고 · 전시하고**  
Request it · Build it · Show it

MadePick is a Korean/English mobile-friendly product discovery and request community prototype.

## Open the web demo

The live-site source is in [index.html](./index.html). No GitHub Codespaces, npm, or installation is required.

To publish: open **Settings → Pages** in this repository, choose **GitHub Actions** for the deployment source, and the included workflow will publish the site to the project's GitHub Pages URL.

The expected address *after successful Pages deployment* is:

https://chlanstjr3-collab.github.io/madepick/

## Try the features

- Post a request and press "I need this"
- Volunteer to build a requested service
- Showcase a website/app using an HTTPS link
- Browse and vote for showcased products
- Sort, filter, search, and switch between Korean and English
- Designed for mobile and desktop

**Prototype limitation:** Items and votes are saved in **your browser's localStorage only**. They do not sync between users or devices. Sample products are fictional examples and not linked to real services. This build does not have authentication, a database, moderation, or real shared voting.

## Next step

Before opening real public submissions: implement authenticated users, shared database (such as Supabase), abuse prevention, and SEO-indexable public content. The separate Next.js starter zip created in the ChatGPT conversation is an alternate foundation, not the currently deployed GitHub Pages version.
