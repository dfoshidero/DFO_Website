# Seed content

Everything on the site that Daniel might want to change without a code change,
extracted verbatim from the current source. One-off input for
`migrate-to-sanity.mjs` (Phase 3) and the reference for parity testing after
Phase 4.

## Document content

| File | Source | Notes |
|---|---|---|
| `projects.json` | `src/content/projects/Projects.jsx` (`projects`) | `id === 1000` is the featured card. `imageUrl` is a repo path. |
| `experiences.json` | `src/content/experience/Experience.jsx` (`experiences`) | `title` is `"Role // Company"`. `longdesc` is raw HTML. `skills` is a ` · `-separated string. `logo` is a repo path. |
| `educations.json` | `src/content/education/Education.jsx` (`educations`) | Missing `type` means certification. |
| `skills.json` | `src/content/expertise/Skills.jsx` (`skills`) | `certified` / `completed` omitted where falsy in the source. |
| `recommendations.json` | `src/utils/recommendationsContext.js` (`recommendations`) | No ids in the source; array order is the order. |
| `siteSettings.json` | `Header.jsx`, `Contact.jsx`, `Footer.jsx`, `Portfolio.jsx`, `AnalogClock.jsx`, `LayoutConfigRandom.jsx` (`getExtraContent`), `statusConfig.js` | Hand-assembled from scattered literals; see the `siteSettings` table in `docs/admin-cms-plan.md`. Holds `profileIcon` and `cvFile`. |

Array order is preserved and is the intended `order` field for migration.
Strings are copied exactly, including the curly apostrophes and the one inline
`<a href>` in the AHMM experience.

## Binary assets

`assets.json` is the upload list for the migration script. Every entry was
derived from an actual asset reference in the files above, so the two cannot
drift apart.

- `upload[]` — 17 assets: the profile icon, the CV, 9 company logos and 6
  project icons. Each carries `path`, `filename`, `mimeType`, `bytes`,
  `assetType` and the `references` that point at it (which seed file, which
  document id, which field).
- `assetType` is `image` for everything except the CV, which is `file` —
  Sanity's image pipeline and file store are separate endpoints.
- `transformable: false` marks the two SVGs (`chip-8.svg`, `deep-rl.svg`) and
  the PDF. Sanity will not resize SVGs, so the frontend's `imageUrl()` helper
  must return the raw asset URL for them.
- The CV is a Sanity **file** asset. Link to it as
  `<url>?dl=<cvDownloadName>` so the CDN sends `Content-Disposition:
  attachment` — the `download` attribute does not work cross-origin.
- `unused[]` — 5 asset files with no reference anywhere in the app
  (`profile.png`, `chip-8.png`, `eco.svg`, `pool.png`, `size_guide.png`).
  Do not upload them. They are deletion candidates for Phase 7.

## Interface copy

`uiText.json` holds the remaining user-facing strings that today are literals
inside components: header and footer labels, card button text, the skills
filter and certification labels, the portfolio card's Instagram text and its
report-issue email, and the whole painting inquiry form.

Judgment calls worth knowing before writing the schema:

- **`cardTitles` is a map, not a list.** The keys (`EXPERIENCE`,
  `MY WORK(S)`, …) are the layout algorithm's card identifiers in
  `LayoutConfigRandom.jsx` and must not change. Only the values are editable,
  so a title can be renamed without touching the layout.
- **`meta` cannot be driven at runtime.** `public/index.html`,
  `manifest.json` and `sitemap.xml` are static files served before React
  boots. These values are seeded so they live in one place; making them
  CMS-driven needs the `prebuild` snapshot script to write them into the HTML.
  Note `manifestName` / `manifestShortName` are still Create React App's
  defaults (`"Create React App Sample"` / `"React App"`).
- **`portfolio.reportEmailBody` is stored decoded**, with real newlines. The
  source URL-encodes it (`%0D%0A`); re-encode at the call site.
- **`inquiryForm` is seeded but blocked.** That form still POSTs to Netlify
  Forms and delivers nothing on Render (step 22). The copy is captured here so
  it is not lost, but do not wire it up until the form has a working backend.
- **`favicon`** points at `public/favicon.png` and is deliberately absent from
  `assets.json` — it is referenced from static HTML, so uploading it achieves
  nothing.

Not seeded, on purpose: CSS class names, form field `name` attributes, the
`painting-inquiry` form name, ARIA roles, and the card size/placement rules.
Those are structural — editing them from a CMS would break the site.
