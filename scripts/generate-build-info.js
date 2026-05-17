const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let lastUpdated;
try {
  lastUpdated = execSync('git log -1 --format=%cI', {
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim();
  if (!lastUpdated) {
    throw new Error('Empty git output');
  }
} catch {
  lastUpdated = new Date().toISOString();
}

const out = path.join(__dirname, '..', 'src', 'buildInfo.json');
fs.writeFileSync(out, JSON.stringify({ lastUpdated }, null, 2) + '\n');
