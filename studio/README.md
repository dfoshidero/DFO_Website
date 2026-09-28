# DFVRO Studio

The Sanity Studio behind `admin.dfvro.com`. Deployed on Render as a static site
from this directory; the website at the repo root is a separate service and
never imports anything from here.

## Local development

```sh
cp .env.example .env    # fill in SANITY_STUDIO_PROJECT_ID
npm install
npm run dev             # http://localhost:3333
```

`sanity.config.ts` throws on start if `SANITY_STUDIO_PROJECT_ID` is missing,
rather than silently building a Studio pointed at nothing.

Other scripts: `npm run build` (outputs `dist/`), `npm run typecheck`,
`npx sanity schema validate`.

## Structure

Two singletons, then five drag-to-reorder lists:

| Item | Type | Notes |
|---|---|---|
| Site settings | `siteSettings` | Name, tagline, profile picture, email, links, CV, status, location, copyright. |
| Interface text | `uiText` | Button labels, hints and messages. Grouped by where they appear. |
| Projects | `project` | `featured` marks the one large card. |
| Experience | `experience` | `longDescription` is rich text. |
| Education & certifications | `education` | `kind` drives the row styling. |
| Skills | `skill` | `certified` / `completed` drive the badges and filters. |
| Recommendations | `recommendation` | |

## Things worth knowing before editing the schemas

- **Ordering is `orderRank`, not a number.** `@sanity/orderable-document-list`
  stores a LexoRank string so dragging one item does not renumber the rest.
  The plan document called for a numeric `order` field; a numeric field and a
  drag handle cannot both be the source of truth, so `orderRank` won it. GROQ
  queries must use `| order(orderRank)`. The migration script generates the
  initial ranks with the `lexorank` package (`LexoRank.min().genNext()`, then
  `.genNext()` per document).
- **Singletons are locked down.** `siteSettings` and `uiText` have their create
  and delete actions removed and are excluded from the global "new document"
  menu, so the fixed document ids the frontend queries cannot be orphaned.
- **Only one project can be featured.** `project.featured` validates against
  the other documents and blocks publishing a second one.
- **`experience.longDescription` is deliberately narrow.** Paragraphs, bullet
  lists, bold, italic and links — nothing else. That is exactly what the old
  HTML contained and what `.experience-body` styles. Adding headings or images
  here would render unstyled on the site.
- **`experience.role` and `experience.company` are separate fields.** The old
  array stored `"Role // Company"` in one string and split it at render time.
- **`uiText.cardTitles` keys are structural.** They identify the card to the
  layout engine in `src/home/LayoutConfigRandom.jsx`. The key is read-only in
  the Studio; only the label is editable.
- **`uiText.meta` needs a redeploy.** Those values end up in `public/index.html`,
  which is static and served before React starts. The seed also records the
  favicon path, which has no field here on purpose — it is referenced from that
  same static HTML, so a Sanity asset would never be read.
- **`uiText.inquiryForm` is editable but not wired.** The painting inquiry form
  still posts to Netlify Forms and does not deliver on Render.
- **`legacyId` is hidden and read-only** on every type. It records the id the
  document had in the old hardcoded arrays so the migration can be re-run
  idempotently. Nothing on the site reads it.

## Deploying

Render static site, root directory `studio`, build `npm ci && npm run build`,
publish `dist`, rewrite `/* → /index.html`, env `SANITY_STUDIO_PROJECT_ID`,
`SANITY_STUDIO_DATASET=production`, `NODE_VERSION=24`. Build filter: only
`studio/**`. See `docs/admin-cms-steps.md` steps 12 to 16.
