# Daniel Favour's Personal Resume Website

This repository contains the code for my personal resume website, hosted at [www.dfvro.com](https://www.dfvro.com). It showcases my professional skills, experiences, and projects.

## Technology Stack

- **Frontend**: JavaScript with React, SCSS for styling.
- **Hosting**: Netlify.
- **Portfolio sync**: GitHub Actions fetches Instagram images daily into `public/portfolio/`.

## Key Dependencies

- `react`, `react-dom`: Core React libraries.
- `@mui/material`, `@mui/icons-material`: Material-UI for UI components.
- `@emotion/react`, `@emotion/styled`: Emotion for styled components in React.
- `axios`: For HTTP requests.
- `react-router-dom`: For navigation and routing.
- `sass`: For SCSS styling.

## Setup and Deployment

- Run `npm start` for local development.
- Deploy using `npm run deploy`, which builds the app and publishes to GitHub Pages.

## Instagram portfolio sync

Portfolio images are synced from Instagram into `public/portfolio/` instead of being fetched live on every page load.

### How it works

1. A GitHub Action (`.github/workflows/sync-instagram.yml`) runs daily at 06:00 UTC.
2. It refreshes the Instagram access token and saves it back to GitHub Secrets.
3. It downloads images to `public/portfolio/images/` and writes metadata to `public/portfolio/images.json`.
4. Changes are committed and pushed; Netlify redeploys automatically.

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
