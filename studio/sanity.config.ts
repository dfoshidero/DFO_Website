import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes, SINGLETON_TYPES} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID is not set. Copy studio/.env.example to studio/.env and fill it in.'
  )
}

// Pinned so a Sanity API change cannot alter Studio behaviour without a code change.
export const API_VERSION = '2024-01-01'

// Singletons must not be creatable or deletable — there is exactly one of each,
// and the frontend queries them by a fixed document id.
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])
const isSingleton = (schemaType: string) =>
  (SINGLETON_TYPES as readonly string[]).includes(schemaType)

export default defineConfig({
  name: 'default',
  title: 'DFVRO',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: API_VERSION})],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !isSingleton(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      isSingleton(schemaType)
        ? actions.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : actions,
    newDocumentOptions: (items, {creationContext}) =>
      creationContext.type === 'global'
        ? items.filter(({templateId}) => !isSingleton(templateId))
        : items,
  },
})
