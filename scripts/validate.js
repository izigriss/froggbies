import fs from 'fs';
import path from 'path';

console.log('--- Running Froggbies Game Repository Integrity Verification ---');

const indexHtmlPath = path.resolve('index.html');
const m2HtmlPath = path.resolve('m2.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('FAIL: index.html does not exist');
  process.exit(1);
}
if (!fs.existsSync(m2HtmlPath)) {
  console.error('FAIL: m2.html does not exist');
  process.exit(1);
}

const content = fs.readFileSync(indexHtmlPath, 'utf8');
const m2Content = fs.readFileSync(m2HtmlPath, 'utf8');

if (content.length < 50000) {
  console.error('FAIL: index.html appears truncated or corrupted');
  process.exit(1);
}

// Check key DOM elements
const requiredIds = [
  'gameCanvas', 'popupLayer', 'gameHUD', 'scoreVal', 'comboBadge',
  'tierBadge', 'comboTimerBar', 'seasonLabel', 'distanceVal',
  'sinkWarning', 'heartsContainer', 'startOverlay', 'startGameBtn',
  'pauseModal', 'resumeBtn', 'restartFromPauseBtn', 'seasonBtn',
  'muteBtn', 'pauseBtn', 'gameOverModal', 'gameOverIcon',
  'gameOverTitle', 'gameOverReason', 'finalScoreVal', 'finalBestVal',
  'finalDistVal', 'finalFliesVal', 'playAgainBtn'
];

let missing = 0;
for (const id of requiredIds) {
  if (!content.includes(`id="${id}"`)) {
    console.error(`FAIL: Missing essential HUD/Game element ID: ${id}`);
    missing++;
  }
}
if (missing > 0) process.exit(1);
console.log(`PASS: All ${requiredIds.length} required HUD/Game DOM elements verified.`);

// Extract and syntax-check JS logic
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
if (!scriptMatch || !scriptMatch[1]) {
  console.error('FAIL: Main game script block could not be extracted');
  process.exit(1);
}

try {
  new Function(scriptMatch[1]);
  console.log('PASS: Game script syntax parsed cleanly without evaluation errors.');
} catch (err) {
  console.error('FAIL: Script parsing error:', err);
  process.exit(1);
}

// Verify external library references
const requiredLibs = [
  'cdn.tailwindcss.com',
  'cdnjs.cloudflare.com/ajax/libs/three.js',
  'fonts.googleapis.com'
];
for (const lib of requiredLibs) {
  if (!content.includes(lib)) {
    console.error(`FAIL: Missing required CDN reference: ${lib}`);
    process.exit(1);
  }
}
console.log('PASS: All external CDN libraries and fonts verified.');
console.log('--- All Verification Tests Passed Successfully! ---');
