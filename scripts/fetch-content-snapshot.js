/**
 * Pulls the whole content tree into src/content/snapshot.json at build time.
 *
 * The app fetches live content on load; this snapshot is the fallback that
 * renders when Sanity is unreachable, so the site can never go blank.
 *
 * Runs on prebuild and prestart, after generate-build-info.js.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'content', 'snapshot.json');

// The query lives in src/lib/queries.js as ES module source, which plain node
// cannot import. Read and evaluate the exported template string instead of
// duplicating it, so the two can never drift.
function loadQuery() {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'queries.js'), 'utf8');
  const body = src
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .split('export ')[0];
  // eslint-disable-next-line no-new-func
  return new Function(`${body}; return CONTENT_QUERY;`)();
}

function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  }
  return {
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  };
}

function haveUsableSnapshot() {
  if (!fs.existsSync(OUT)) return false;
  try {
    const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    return Boolean(existing && existing.settings);
  } catch {
    return false;
  }
}

function giveUp(reason) {
  if (haveUsableSnapshot()) {
    console.warn(`[snapshot] ${reason}. Keeping the existing ${path.relative(ROOT, OUT)}.`);
    process.exit(0);
  }
  console.error(
    `[snapshot] ${reason}, and there is no previous snapshot to fall back on.\n` +
      `[snapshot] The site would ship with no content. Set REACT_APP_SANITY_PROJECT_ID ` +
      `and REACT_APP_SANITY_DATASET, then build again.`
  );
  process.exit(1);
}

async function main() {
  const { projectId, dataset } = loadEnv();
  if (!projectId) giveUp('REACT_APP_SANITY_PROJECT_ID is not set');

  const { createClient } = require('@sanity/client');
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false, // build time: take the freshest content, not the CDN's copy
    perspective: 'published',
  });

  let content;
  try {
    content = await client.fetch(loadQuery());
  } catch (error) {
    giveUp(`Could not reach Sanity (${error.message})`);
  }

  if (!content || !content.settings) {
    giveUp('Sanity returned no site settings (has the migration been run?)');
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(content, null, 2) + '\n');

  const counts = ['projects', 'experiences', 'educations', 'skills', 'recommendations']
    .map((key) => `${(content[key] || []).length} ${key}`)
    .join(', ');
  console.log(`[snapshot] Wrote ${path.relative(ROOT, OUT)} (${counts}).`);
}

main().catch((error) => {
  giveUp(`Snapshot failed (${error.message})`);
});
