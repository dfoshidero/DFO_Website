# Daniel Favour's Personal Resume Website

This repository contains the code for my personal resume website, hosted at [www.dfvro.com](https://www.dfvro.com). It showcases my professional skills, experiences, and projects.

## Technology Stack

- **Frontend**: JavaScript with React, SCSS for styling.
- **Content**: Sanity. Edited at [admin.dfvro.com](https://admin.dfvro.com), the Studio in `studio/`.
- **Hosting**: Render, two static sites from this repo (the website at the root, the Studio in `studio/`). Cloudflare in front for DNS.
- **Portfolio sync**: GitHub Actions fetches Instagram images daily into `public/portfolio/`.

## Editing the site

Two paths, and which one you need depends on what is changing:

| Change | Where | Live in |
|---|---|---|
| Wording, projects, experience, education, skills, recommendations, status, links, profile picture, CV | [admin.dfvro.com](https://admin.dfvro.com) — edit and publish | Seconds, no deploy |
| Design, layout, components, behaviour | A PR to `main` | One Render deploy |

Content is fetched from Sanity on page load, so publishing in the Studio is live
on the next refresh. No deploy, and no Sanity webhook, is needed for content.

A copy is also baked into the bundle at build time (`src/content/snapshot.json`,
gitignored) purely as a fallback: if Sanity is unreachable the site renders the
last known content instead of going blank. The only reason to add a Sanity
webhook pointing at a Render deploy hook is to keep that fallback fresh — it is
optional, and nothing on the page depends on it.

Two things do still come from the build rather than the CMS: the footer's "last
updated" date, which is the git commit date, and the static `<title>` and
description in `public/index.html`, which exist for crawlers and link previews
that do not run JavaScript. The live values override those on load.

## Key Dependencies

- `react`, `react-dom`: Core React libraries.
- `@sanity/client`, `@sanity/image-url`: Reads content and builds asset URLs.
- `@portabletext/react`: Renders the rich-text experience descriptions.
- `@mui/material`, `@mui/icons-material`: Material-UI for UI components.
- `@emotion/react`, `@emotion/styled`: Emotion for styled components in React.
- `axios`: For HTTP requests.
- `react-router-dom`: For navigation and routing.
- `sass`: For SCSS styling.

## Setup and Deployment

```bash
cp .env.example .env    # add REACT_APP_SANITY_PROJECT_ID
npm install
npm start
```

`prestart` and `prebuild` write `src/buildInfo.json` and pull
`src/content/snapshot.json` from Sanity. The build fails if it cannot reach
Sanity and no previous snapshot exists, rather than shipping an empty site.

Pushing to `main` deploys both Render services. Render's build filters keep them
apart: the website ignores `studio/**`, and the Studio builds only on `studio/**`.

### Repository layout

| Path | What |
|---|---|
| `src/` | The website. |
| `studio/` | Sanity Studio, its own `package.json`. See `studio/README.md`. |
| `scripts/migration/` | One-off seeding of Sanity from the former hardcoded arrays. Kept for reference; see its README before re-running. |

## Instagram portfolio sync

Portfolio images are synced from Instagram into `public/portfolio/` instead of being fetched live on every page load.

### How it works

1. A GitHub Action (`.github/workflows/sync-instagram.yml`) runs daily at 06:00 UTC.
2. It refreshes the Instagram access token and saves it back to GitHub Secrets.
3. It downloads images to `public/portfolio/images/` and writes metadata to `public/portfolio/images.json`.
4. Changes are committed and pushed; Render redeploys automatically.

### Manual sync

Go to **Actions → Sync Instagram Portfolio → Run workflow** to sync immediately after posting new work on Instagram.

### Local sync

```bash
INSTAGRAM_ACCESS_TOKEN=your_token npm run sync-instagram
```

Optional: set `GH_PAT` to persist a refreshed token back to GitHub Secrets (same as CI).

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived Instagram Graph API token |
| `GH_PAT` | PAT with **Secrets: read and write** on this repo (for token refresh persistence) |

### Legacy AWS setup (optional cleanup)

The previous API Gateway + Lambda flow is no longer used by the frontend. Once the GitHub Action has run successfully for a few days, you can decommission:

- The Lambda function
- The API Gateway endpoint (`fetchInstagramData`)
- The SSM parameter `REACT_APP_INSTAGRAM_ACCESS_TOKEN_UNTITLEDFVR` (if unused elsewhere)
