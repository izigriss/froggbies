import fs from 'fs';
import path from 'path';

console.log('--- Running Froggbies Game Repository Integrity Verification ---');

const indexHtmlPath = path.resolve('index.html');
const m2HtmlPath = path.resolve('m2.html');
const cssPath = path.resolve('css/style.css');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('FAIL: index.html does not exist');
  process.exit(1);
}
if (!fs.existsSync(m2HtmlPath)) {
  console.error('FAIL: m2.html does not exist');
  process.exit(1);
}
if (!fs.existsSync(cssPath)) {
  console.error('FAIL: css/style.css does not exist');
  process.exit(1);
}

const content = fs.readFileSync(indexHtmlPath, 'utf8');
const m2Content = fs.readFileSync(m2HtmlPath, 'utf8');

// Check key DOM elements in index.html
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
console.log(`PASS: All ${requiredIds.length} required HUD/Game DOM elements verified in index.html.`);

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
console.log('PASS: All external CDN libraries and fonts verified in index.html.');

// Verify modular source files exist
const requiredSourceFiles = [
  'src/main.js',
  'src/game.js',
  'src/audio.js',
  'src/textures.js',
  'src/materials.js',
  'src/entities/frog.js',
  'src/entities/environment.js',
  'src/state.js',
  'src/ui.js',
  'src/particles.js',
  'src/constants.js'
];

for (const sf of requiredSourceFiles) {
  const sfPath = path.resolve(sf);
  if (!fs.existsSync(sfPath)) {
    console.error(`FAIL: Missing modular source file: ${sf}`);
    process.exit(1);
  }
  const fileContent = fs.readFileSync(sfPath, 'utf8');
  if (fileContent.length < 50) {
    console.error(`FAIL: File appears suspiciously empty: ${sf}`);
    process.exit(1);
  }
}
console.log(`PASS: All ${requiredSourceFiles.length} modular source files exist and verified.`);

// Verify legacy m2.html integrity
if (m2Content.length < 100000) {
  console.error('FAIL: m2.html appears truncated');
  process.exit(1);
}
console.log('PASS: m2.html verified as intact standalone legacy build.');

console.log('--- All Verification Tests Passed Successfully! ---');
