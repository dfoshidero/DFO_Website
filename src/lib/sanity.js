import { createClient } from '@sanity/client';

export const SANITY_PROJECT_ID = process.env.REACT_APP_SANITY_PROJECT_ID;
export const SANITY_DATASET = process.env.REACT_APP_SANITY_DATASET || 'production';

// Pinned so a Sanity API change cannot alter what the site renders without a
// code change. Must match the version the Studio and migration script use.
const API_VERSION = '2024-01-01';

export const isSanityConfigured = Boolean(SANITY_PROJECT_ID);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: API_VERSION,
      // Serve from the CDN. The dataset is public and read-only here; no token.
      useCdn: true,
      perspective: 'published',
    })
  : null;

/**
 * URL for an asset the query already dereferenced to { url, extension }.
 *
 * Sanity's image pipeline cannot transform SVGs, so those return the raw URL.
 * Everything else gets a width hint and automatic format negotiation.
 */
export function imageUrl(asset, width) {
  if (!asset?.url) return undefined;
  if (asset.extension === 'svg') return asset.url;

  const params = ['auto=format'];
  if (width) params.push(`w=${width}`, 'fit=max');
  return `${asset.url}?${params.join('&')}`;
}

/**
 * Download URL for a file asset. Browsers ignore the `download` attribute on
 * cross-origin links, so Sanity's ?dl= parameter is what actually makes the CDN
 * send Content-Disposition: attachment.
 */
export function downloadUrl(asset, filename) {
  if (!asset?.url) return undefined;
  return filename ? `${asset.url}?dl=${encodeURIComponent(filename)}` : asset.url;
}
