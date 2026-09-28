import {htmlToBlocks} from '@portabletext/block-tools'
import {Schema} from '@sanity/schema'
import {JSDOM} from 'jsdom'

/**
 * Mirrors the `longDescription` field in studio/schemaTypes/experience.ts.
 * block-tools needs a compiled schema type, not the JSON the Studio extracts,
 * so the shape is restated here. `assertRepresentable` below catches drift by
 * checking the output rather than trusting this to stay in sync.
 */
const ALLOWED_STYLES = new Set(['normal'])
const ALLOWED_LISTS = new Set(['bullet'])
const ALLOWED_DECORATORS = new Set(['strong', 'em'])
const ALLOWED_ANNOTATIONS = new Set(['link'])

const compiled = Schema.compile({
  name: 'migration',
  types: [
    {
      name: 'experience',
      type: 'object',
      fields: [
        {
          name: 'longDescription',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{title: 'Paragraph', value: 'normal'}],
              lists: [{title: 'Bullet', value: 'bullet'}],
              marks: {
                decorators: [
                  {title: 'Bold', value: 'strong'},
                  {title: 'Italic', value: 'em'},
                ],
                annotations: [
                  {
                    name: 'link',
                    title: 'Link',
                    type: 'object',
                    fields: [{name: 'href', type: 'url', title: 'URL'}],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
})

const blockContentType = compiled
  .get('experience')
  .fields.find((field) => field.name === 'longDescription').type

/**
 * Deterministic keys. Portable Text needs a _key on every block, span and
 * markDef; random ones would make every re-run of the migration produce a
 * different document and defeat createOrReplace idempotency.
 */
function keyGenerator(prefix) {
  let n = 0
  return () => `${prefix}${(n++).toString(36)}`
}

/**
 * Fails loudly if the HTML produced something the Studio schema cannot render —
 * a heading, a numbered list, an image, an unknown annotation. Silent drops are
 * the main risk in an HTML to Portable Text conversion.
 */
function assertRepresentable(blocks, label) {
  const problems = []

  for (const block of blocks) {
    if (block._type !== 'block') {
      problems.push(`non-block content of type "${block._type}"`)
      continue
    }
    if (block.style && !ALLOWED_STYLES.has(block.style)) {
      problems.push(`style "${block.style}"`)
    }
    if (block.listItem && !ALLOWED_LISTS.has(block.listItem)) {
      problems.push(`list type "${block.listItem}"`)
    }
    for (const def of block.markDefs ?? []) {
      if (!ALLOWED_ANNOTATIONS.has(def._type)) problems.push(`annotation "${def._type}"`)
      if (def._type === 'link' && !def.href) problems.push('link with no href')
    }
    const defKeys = new Set((block.markDefs ?? []).map((d) => d._key))
    for (const child of block.children ?? []) {
      for (const mark of child.marks ?? []) {
        if (!ALLOWED_DECORATORS.has(mark) && !defKeys.has(mark)) {
          problems.push(`mark "${mark}" with no matching decorator or markDef`)
        }
      }
    }
  }

  if (problems.length) {
    throw new Error(
      `${label}: converted rich text contains things the Studio schema cannot store:\n` +
        [...new Set(problems)].map((p) => `  - ${p}`).join('\n')
    )
  }
}

/** Visible text of a Portable Text array, for comparing against the source HTML. */
export function plainText(blocks) {
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
    .join('\n')
}

/** Visible text of an HTML string, using the same DOM the converter used. */
export function htmlPlainText(html) {
  const {window} = new JSDOM(`<body>${html}</body>`)
  return window.document.body.textContent ?? ''
}

export function convertHtml(html, {label, keyPrefix}) {
  const blocks = htmlToBlocks(html, blockContentType, {
    keyGenerator: keyGenerator(keyPrefix),
    parseHtml: (chunk) => new JSDOM(chunk).window.document,
  })

  if (!blocks.length) throw new Error(`${label}: HTML converted to zero blocks`)
  assertRepresentable(blocks, label)

  // Compare visible characters so a dropped paragraph or list item cannot pass.
  // Whitespace is stripped entirely: textContent runs adjacent block elements
  // together, while Portable Text keeps them as separate blocks.
  const normalise = (s) => s.replace(/\s+/g, '')
  const before = normalise(htmlPlainText(html))
  const after = normalise(plainText(blocks))
  if (before !== after) {
    throw new Error(
      `${label}: text changed during conversion.\n  HTML : ${before.slice(0, 160)}\n  Blocks: ${after.slice(0, 160)}`
    )
  }

  return blocks
}
