#!/usr/bin/env node
/**
 * One-off: seeds Sanity from scripts/migration/seed/*.json, the verbatim copy of
 * the arrays that used to be hardcoded in the components.
 *
 *   node migrate-to-sanity.mjs --dry-run     # show what would happen, write nothing
 *   node migrate-to-sanity.mjs               # do it
 *
 * Safe to run more than once: assets are matched by content hash and documents
 * use fixed ids, so a second run replaces rather than duplicates. Re-running
 * DOES discard Studio edits to the documents it manages — see --help.
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {createClient} from '@sanity/client'
import {LexoRank} from 'lexorank'

import {convertHtml} from './lib/portable-text.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const SEED = path.join(HERE, 'seed')
const API_VERSION = '2024-01-01'

const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')
const SHOW_JSON = args.has('--json')

if (args.has('--help') || args.has('-h')) {
  console.log(`
Seeds Sanity from scripts/migration/seed/*.json.

  --dry-run   Resolve and build every document, then print a summary and exit
              without uploading or writing anything.
  --json      Also print the full document bodies.
  --help      This.

Env, read from ${path.join(ROOT, '.env')}:
  SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN (Editor permission)

Documents are written with fixed ids (siteSettings, uiText, project-1000,
experience-0, ...) using createOrReplace. Anything edited in the Studio on those
documents is overwritten. This is intended for the initial seed only; after
step 9 of docs/admin-cms-steps.md, the Studio is the source of truth.
`)
  process.exit(0)
}

// ---------------------------------------------------------------- environment

function loadEnv() {
  const envPath = path.join(ROOT, '.env')
  if (fs.existsSync(envPath)) process.loadEnvFile(envPath)

  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET ?? 'production'
  const token = process.env.SANITY_WRITE_TOKEN

  const missing = [
    !projectId && 'SANITY_PROJECT_ID',
    !DRY_RUN && !token && 'SANITY_WRITE_TOKEN',
  ].filter(Boolean)

  if (missing.length) {
    console.error(
      `Missing ${missing.join(' and ')} in ${envPath}.\n` +
        `Copy .env.example to .env and fill it in. Find the project id with:\n` +
        `  cd studio && npx sanity projects list`
    )
    process.exit(1)
  }
  return {projectId, dataset, token}
}

// ----------------------------------------------------------------------- seed

const readSeed = (name) => JSON.parse(fs.readFileSync(path.join(SEED, name), 'utf8'))

const seed = {
  projects: readSeed('projects.json'),
  experiences: readSeed('experiences.json'),
  educations: readSeed('educations.json'),
  skills: readSeed('skills.json'),
  recommendations: readSeed('recommendations.json'),
  settings: readSeed('siteSettings.json'),
  uiText: readSeed('uiText.json'),
  assets: readSeed('assets.json'),
}

/** Sequential LexoRank strings, matching what @sanity/orderable-document-list expects. */
function rankSequence(count) {
  const ranks = []
  let rank = LexoRank.min().genNext()
  for (let i = 0; i < count; i++) {
    ranks.push(rank.toString())
    rank = rank.genNext()
  }
  return ranks
}

// --------------------------------------------------------------------- assets

const assetMeta = new Map(seed.assets.upload.map((a) => [a.path, a]))

function assetPlan() {
  const missing = seed.assets.upload.filter((a) => !fs.existsSync(path.join(ROOT, a.path)))
  if (missing.length) {
    console.error(`These assets are listed in seed/assets.json but not on disk:`)
    missing.forEach((a) => console.error(`  ${a.path}`))
    process.exit(1)
  }
}

function makeAssetResolver(client) {
  const cache = new Map()
  const uploaded = []
  const reused = []

  async function resolve(relPath) {
    if (cache.has(relPath)) return cache.get(relPath)

    const meta = assetMeta.get(relPath)
    if (!meta) throw new Error(`${relPath} is referenced by a seed document but absent from assets.json`)

    const bytes = fs.readFileSync(path.join(ROOT, relPath))
    const sha1 = crypto.createHash('sha1').update(bytes).digest('hex')

    if (DRY_RUN) {
      const id = `<${meta.assetType}:${meta.filename}>`
      cache.set(relPath, id)
      uploaded.push(meta)
      return id
    }

    // Sanity stores the sha1 of the original file, so an identical asset from a
    // previous run is found rather than uploaded again.
    const sanityType = meta.assetType === 'file' ? 'sanity.fileAsset' : 'sanity.imageAsset'
    const existing = await client.fetch(`*[_type == $type && sha1hash == $sha1][0]._id`, {
      type: sanityType,
      sha1,
    })

    let id
    if (existing) {
      id = existing
      reused.push(meta)
    } else {
      const asset = await client.assets.upload(meta.assetType, bytes, {
        filename: meta.filename,
        contentType: meta.mimeType,
      })
      id = asset._id
      uploaded.push(meta)
    }

    cache.set(relPath, id)
    return id
  }

  const ref = (kind) => async (relPath) => ({
    _type: kind,
    asset: {_type: 'reference', _ref: await resolve(relPath)},
  })

  return {image: ref('image'), file: ref('file'), uploaded, reused}
}

// ------------------------------------------------------------------ documents

const TITLE_SEPARATOR = ' // '
const SKILL_SEPARATOR = ' · '

/** `"Role // Company"` was one string in the old array; the schema keeps them apart. */
function splitTitle(title) {
  const idx = title.indexOf(TITLE_SEPARATOR)
  if (idx === -1) return {role: title.trim(), company: undefined}
  return {
    role: title.slice(0, idx).trim(),
    company: title.slice(idx + TITLE_SEPARATOR.length).trim(),
  }
}

/** Drops undefined and empty-string fields so optional fields stay absent, not blank. */
function compact(doc) {
  return Object.fromEntries(
    Object.entries(doc).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  )
}

async function buildDocuments(assets) {
  const docs = []

  // --- siteSettings -------------------------------------------------------
  const s = seed.settings
  docs.push(
    compact({
      _id: 'siteSettings',
      _type: 'siteSettings',
      fullName: s.fullName,
      tagline: s.tagline,
      profileIcon: await assets.image(s.profileIcon),
      contactEmail: s.contactEmail,
      linkedinUrl: s.linkedinUrl,
      githubUrl: s.githubUrl,
      recommendationsMoreUrl: s.recommendationsMoreUrl,
      projectsMoreUrl: s.projectsMoreUrl,
      cvFile: await assets.file(s.cvFile),
      cvDownloadName: s.cvDownloadName,
      status: {
        indicatorSeverity: s.status.indicatorSeverity,
        lines: s.status.lines.map((line, i) => ({
          _key: `status-line-${i}`,
          _type: 'statusLine',
          message: line.message,
          severity: line.severity,
        })),
      },
      timezoneLabel: s.timezoneLabel,
      timezoneIana: s.timezoneIana,
      copyrightName: s.copyrightName,
    })
  )

  // --- uiText -------------------------------------------------------------
  // `favicon` is seeded for the record but has no schema field: index.html is
  // static, so a Sanity asset would never be read. See seed/README.md.
  const {cardTitles, meta, ...uiGroups} = seed.uiText
  const {favicon, ...metaFields} = meta
  docs.push({
    _id: 'uiText',
    _type: 'uiText',
    cardTitles: Object.entries(cardTitles).map(([key, label], i) => ({
      _key: `card-${i}`,
      _type: 'cardTitle',
      key,
      label,
    })),
    ...uiGroups,
    meta: metaFields,
  })

  // --- projects -----------------------------------------------------------
  const projectRanks = rankSequence(seed.projects.length)
  for (const [i, p] of seed.projects.entries()) {
    docs.push(
      compact({
        _id: `project-${p.id}`,
        _type: 'project',
        title: p.title,
        description: p.description,
        stack: p.stack,
        image: p.imageUrl ? await assets.image(p.imageUrl) : undefined,
        projectUrl: p.projectUrl,
        videoUrl: p.videoUrl,
        // Replaces the old `id === 1000` convention.
        featured: p.id === 1000,
        legacyId: p.id,
        orderRank: projectRanks[i],
      })
    )
  }

  // --- experiences --------------------------------------------------------
  const experienceRanks = rankSequence(seed.experiences.length)
  for (const [i, e] of seed.experiences.entries()) {
    const {role, company} = splitTitle(e.title)
    docs.push(
      compact({
        _id: `experience-${e.id}`,
        _type: 'experience',
        role,
        company,
        location: e.location,
        shortDescription: e.shortdesc,
        longDescription: convertHtml(e.longdesc, {
          label: `experience-${e.id} (${role})`,
          keyPrefix: `e${e.id}-`,
        }),
        skills: e.skills
          ? e.skills.split(SKILL_SEPARATOR).map((x) => x.trim()).filter(Boolean)
          : undefined,
        logo: await assets.image(e.logo),
        legacyId: e.id,
        orderRank: experienceRanks[i],
      })
    )
  }

  // --- educations ---------------------------------------------------------
  const educationRanks = rankSequence(seed.educations.length)
  for (const [i, ed] of seed.educations.entries()) {
    docs.push(
      compact({
        _id: `education-${ed.id}`,
        _type: 'education',
        title: ed.title,
        // An absent `type` meant "certification" in the old array.
        kind: ed.type ?? 'certification',
        school: ed.school,
        location: ed.location,
        graduation: ed.graduation,
        achieved: ed.achieved,
        link: ed.link,
        legacyId: ed.id,
        orderRank: educationRanks[i],
      })
    )
  }

  // --- skills -------------------------------------------------------------
  const skillRanks = rankSequence(seed.skills.length)
  for (const [i, sk] of seed.skills.entries()) {
    docs.push(
      compact({
        _id: `skill-${sk.id}`,
        _type: 'skill',
        name: sk.skill,
        certified: sk.certified ?? false,
        completed: sk.completed ?? false,
        link: sk.link,
        legacyId: sk.id,
        orderRank: skillRanks[i],
      })
    )
  }

  // --- recommendations ----------------------------------------------------
  // The old array had no ids, so position is the identity.
  const recommendationRanks = rankSequence(seed.recommendations.length)
  for (const [i, r] of seed.recommendations.entries()) {
    docs.push(
      compact({
        _id: `recommendation-${i + 1}`,
        _type: 'recommendation',
        text: r.text,
        recommender: r.recommender,
        role: r.role,
        orderRank: recommendationRanks[i],
      })
    )
  }

  return docs
}

/** Catches an id collision before it silently overwrites a document. */
function assertUniqueIds(docs) {
  const seen = new Map()
  for (const doc of docs) {
    if (seen.has(doc._id)) throw new Error(`duplicate document id "${doc._id}"`)
    seen.set(doc._id, doc)
  }
}

// ----------------------------------------------------------------------- main

async function main() {
  const {projectId, dataset, token} = loadEnv()
  assetPlan()

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: API_VERSION,
    useCdn: false,
  })

  const assets = makeAssetResolver(client)

  console.log(
    `${DRY_RUN ? 'DRY RUN — nothing will be written' : 'Migrating'}  ` +
      `project ${projectId}, dataset ${dataset}\n`
  )

  const docs = await buildDocuments(assets)
  assertUniqueIds(docs)

  const byType = docs.reduce((acc, d) => {
    acc[d._type] = (acc[d._type] ?? 0) + 1
    return acc
  }, {})

  console.log('Documents')
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${String(count).padStart(3)}  ${type}`)
  }

  console.log('\nAssets')
  console.log(`  ${String(assets.uploaded.length).padStart(3)}  ${DRY_RUN ? 'to upload' : 'uploaded'}`)
  if (assets.reused.length) console.log(`  ${String(assets.reused.length).padStart(3)}  reused (already in Sanity)`)

  const blockCount = docs
    .filter((d) => d._type === 'experience')
    .reduce((n, d) => n + d.longDescription.length, 0)
  console.log(`\nRich text\n  ${String(blockCount).padStart(3)}  portable text blocks converted from HTML`)

  if (SHOW_JSON) {
    console.log('\n--- documents ---')
    console.log(JSON.stringify(docs, null, 2))
  }

  if (DRY_RUN) {
    console.log('\nDry run complete. Re-run without --dry-run to write.')
    return
  }

  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction())
  await tx.commit({visibility: 'sync'})

  console.log(`\nWrote ${docs.length} documents. Check them in the Studio against the live site.`)
}

main().catch((error) => {
  console.error(`\nMigration failed: ${error.message}`)
  if (process.env.DEBUG) console.error(error)
  process.exit(1)
})
