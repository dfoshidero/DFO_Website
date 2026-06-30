import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORTFOLIO_DIR = path.join(__dirname, '..', 'public', 'portfolio');
const IMAGES_DIR = path.join(PORTFOLIO_DIR, 'images');
const MANIFEST_PATH = path.join(PORTFOLIO_DIR, 'images.json');

const CONTENT_TYPE_EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function getAccessToken() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN environment variable is required');
  }
  return token;
}

async function refreshLongLivedToken(accessToken) {
  const url = new URL('https://graph.instagram.com/refresh_access_token');
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', accessToken);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to refresh Instagram token: ${response.status}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to refresh Instagram token: missing access_token');
  }

  return data.access_token;
}

function updateTokenInGitHubSecret(token) {
  const ghPat = process.env.GH_PAT;
  if (!ghPat) {
    console.log('GH_PAT not set; skipping GitHub secret update');
    return;
  }

  try {
    execSync('gh secret set INSTAGRAM_ACCESS_TOKEN', {
      input: token,
      env: { ...process.env, GH_TOKEN: ghPat },
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    console.log('Updated INSTAGRAM_ACCESS_TOKEN in GitHub secrets');
  } catch (error) {
    throw new Error(`Failed to update GitHub secret: ${error.message}`);
  }
}

async function fetchInstagramData(accessToken) {
  const allImages = [];
  let nextPage = `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,media_url,timestamp,children{media_type,media_url}&access_token=${accessToken}`;

  while (nextPage) {
    const response = await fetch(nextPage);
    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram media: ${response.status}`);
    }

    const payload = await response.json();
    const mediaData = payload.data || [];

    for (const mediaItem of mediaData) {
      if (mediaItem.media_type === 'IMAGE') {
        allImages.push(mediaItem);
      } else if (mediaItem.media_type === 'CAROUSEL_ALBUM') {
        const carouselImages = (mediaItem.children?.data || []).filter(
          (child) => child.media_type === 'IMAGE'
        );
        for (const carouselImage of carouselImages) {
          carouselImage.caption = mediaItem.caption;
        }
        allImages.push(...carouselImages);
      }
    }

    nextPage = payload.paging?.next || null;
  }

  return allImages.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

function extensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      return ext === '.jpeg' ? '.jpg' : ext;
    }
  } catch {
    // fall through
  }
  return null;
}

function extensionFromContentType(contentType) {
  if (!contentType) return '.jpg';
  const base = contentType.split(';')[0].trim().toLowerCase();
  return CONTENT_TYPE_EXT[base] || '.jpg';
}

async function downloadImage(image) {
  const response = await fetch(image.media_url);
  if (!response.ok) {
    throw new Error(`Failed to download image ${image.id}: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  const ext =
    extensionFromUrl(image.media_url) ||
    extensionFromContentType(contentType);
  const filename = `${image.id}${ext}`;
  const filePath = path.join(IMAGES_DIR, filename);
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return {
    id: image.id,
    caption: image.caption || '',
    media_type: image.media_type,
    media_url: `/portfolio/images/${filename}`,
    timestamp: image.timestamp,
  };
}

function removeStaleImages(currentFilenames) {
  if (!fs.existsSync(IMAGES_DIR)) return;

  for (const filename of fs.readdirSync(IMAGES_DIR)) {
    if (!currentFilenames.has(filename)) {
      fs.unlinkSync(path.join(IMAGES_DIR, filename));
      console.log(`Removed stale image: ${filename}`);
    }
  }
}

async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  let accessToken = getAccessToken();
  accessToken = await refreshLongLivedToken(accessToken);
  updateTokenInGitHubSecret(accessToken);

  const instagramImages = await fetchInstagramData(accessToken);
  console.log(`Fetched ${instagramImages.length} images from Instagram`);

  const manifest = [];
  const currentFilenames = new Set();

  for (const image of instagramImages) {
    const entry = await downloadImage(image);
    manifest.push(entry);
    currentFilenames.add(path.basename(entry.media_url));
    console.log(`Downloaded ${entry.media_url}`);
  }

  removeStaleImages(currentFilenames);

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Wrote ${manifest.length} entries to ${MANIFEST_PATH}`);
}

main().catch((error) => {
  console.error('Instagram sync failed:', error.message);
  process.exit(1);
});
