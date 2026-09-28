# Migration

One-off seeding of Sanity from `seed/*.json`, the verbatim copy of the content
that used to be hardcoded in the components. Not part of the site build — it has
its own `package.json` so `jsdom` and the Sanity tooling never reach the
website's dependency tree or a Render build.

## Running it (step 9)

Fill in `SANITY_PROJECT_ID` and `SANITY_WRITE_TOKEN` in the repo-root `.env`,
then:

```sh
cd scripts/migration
npm install
npm run dry-run     # builds everything, writes nothing
npm run migrate     # does it
```

`--json` prints the full document bodies. `--help` explains the flags.

Do the dry run first. It performs every conversion and validation the real run
does, so anything that would fail, fails there — without touching the dataset.

## What it does

1. Resolves the 17 assets in `seed/assets.json`, matching by SHA-1 so an asset
   already in Sanity is reused rather than uploaded twice. The CV goes to the
   file store, everything else to the image pipeline.
2. Converts each experience's `longdesc` HTML to Portable Text.
3. Writes 46 documents in a single transaction with fixed ids — `siteSettings`,
   `uiText`, `project-1000`, `experience-0`, `education-1003`, `skill-1`,
   `recommendation-1` and so on — using `createOrReplace`.

Re-running is safe in the sense that it replaces rather than duplicates. It is
**not** safe after you start editing in the Studio: `createOrReplace` discards
those edits on the documents it manages. After step 9, the Studio is the source
of truth and this script should not be run again.

## Guarantees the script enforces

The conversion is where content silently goes missing, so it is checked rather
than trusted. Any failure aborts before a single write:

- **Nothing is dropped.** The visible text of each converted block array is
  compared against the visible text of the source HTML, whitespace removed. A
  lost paragraph or list item fails the run.
- **Nothing unstorable is produced.** Every block's style, list type, decorator
  and annotation is checked against what `experience.longDescription` actually
  accepts. A heading or numbered list that the Studio could not round-trip
  fails the run.
- **Output is deterministic.** Portable Text `_key`s are generated from the
  document id and position, not randomly, so two runs produce byte-identical
  documents and `createOrReplace` is genuinely idempotent.
- **Ids are unique.** Checked before the transaction is built.
- **Assets exist.** All 17 paths are confirmed on disk before anything uploads.

## Transformations applied

| Seed | Document | Why |
|---|---|---|
| `title: "Role // Company"` | `role`, `company` | The old string was split at render time. |
| `skills: "A · B · C"` | `skills: ['A','B','C']` | Array field. An empty string becomes no field at all. |
| `longdesc` HTML | `longDescription` Portable Text | Removes `dangerouslySetInnerHTML`. |
| `type` absent | `kind: 'certification'` | Absent meant certification in the old array. |
| `id === 1000` | `featured: true` | Replaces the magic number. |
| array position | `orderRank` LexoRank | What the drag-to-reorder plugin reads. |
| `id` | `legacyId` | Hidden. Keeps ids stable across re-runs. |

`graduation` strings are copied exactly, including the leading space on one of
them, because visual parity with the live site is the acceptance test. Tidy
them in the Studio afterwards if you want.
