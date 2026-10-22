import { state } from './state.js';
import { saveHighScore } from './constants.js';

export const dom = {
  canvas: document.getElementById('gameCanvas'),
  popupLayer: document.getElementById('popupLayer'),
  gameHUD: document.getElementById('gameHUD'),
  scoreVal: document.getElementById('scoreVal'),
  menuHighScoreVal: document.getElementById('menuHighScoreVal'),
  highScoreVal: document.getElementById('highScoreVal'),
  comboBadge: document.getElementById('comboBadge'),
  tierBadge: document.getElementById('tierBadge'),
  comboTimerBar: document.getElementById('comboTimerBar'),
  seasonLabel: document.getElementById('seasonLabel'),
  distanceVal: document.getElementById('distanceVal'),
  sinkWarning: document.getElementById('sinkWarning'),
  heartsContainer: document.getElementById('heartsContainer'),

  startOverlay: document.getElementById('startOverlay'),
  startGameBtn: document.getElementById('startGameBtn'),
  pauseModal: document.getElementById('pauseModal'),
  resumeBtn: document.getElementById('resumeBtn'),
  restartFromPauseBtn: document.getElementById('restartFromPauseBtn'),
  seasonBtn: document.getElementById('seasonBtn'),
  muteBtn: document.getElementById('muteBtn'),
  menuAudioBtn: document.getElementById('menuAudioBtn'),
  menuGuideBtn: document.getElementById('menuGuideBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  gameOverModal: document.getElementById('gameOverModal'),
  gameOverIcon: document.getElementById('gameOverIcon'),
  gameOverTitle: document.getElementById('gameOverTitle'),
  gameOverReason: document.getElementById('gameOverReason'),
  finalScoreVal: document.getElementById('finalScoreVal'),
  finalBestVal: document.getElementById('finalBestVal'),
  finalDistVal: document.getElementById('finalDistVal'),
  finalFliesVal: document.getElementById('finalFliesVal'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  koTopBanner: document.getElementById('koTopBanner'),
  koBottomDock: document.getElementById('koBottomDock')
};

export function updateHUD() {
  if (state.score > state.highScore) {
    state.highScore = state.score;
    saveHighScore(state.highScore);
  }
  if (dom.scoreVal) dom.scoreVal.textContent = state.score.toLocaleString();
  if (dom.highScoreVal) dom.highScoreVal.textContent = state.highScore.toLocaleString();
  if (dom.menuHighScoreVal) dom.menuHighScoreVal.textContent = state.highScore.toLocaleString();
  if (dom.distanceVal) dom.distanceVal.textContent = `${Math.floor(state.distance)}m`;
  const isFever = state.streak >= 5;
  if (dom.comboBadge) {
    dom.comboBadge.textContent = isFever ? `🔥 ${state.streak}x FEVER!` : `${Math.max(1, state.streak)}x`;
    dom.comboBadge.className = isFever
      ? 'game-font px-2 py-0.5 rounded-md text-xs font-extrabold bg-rose-500 text-white animate-bounce'
      : 'game-font px-2 py-0.5 rounded-md text-xs font-extrabold bg-amber-400 text-slate-950';
  }
  if (dom.tierBadge) dom.tierBadge.textContent = `LVL ${state.difficultyTier}`;
  if (dom.heartsContainer) {
    let hearts = '';
    for (let i = 0; i < state.maxLives; i++) hearts += i < state.lives ? '❤️' : '🖤';
    dom.heartsContainer.textContent = hearts;
  }
}

export function revealAnimatedScorecard() {
  if (!dom.gameOverModal) return;
  dom.gameOverModal.classList.remove('hidden');

  if (dom.koTopBanner) {
    dom.koTopBanner.classList.remove('anim-drop-in');
    void dom.koTopBanner.offsetWidth;
    dom.koTopBanner.classList.add('anim-drop-in');
  }
  if (dom.koBottomDock) {
    dom.koBottomDock.classList.remove('anim-rise-up');
    void dom.koBottomDock.offsetWidth;
    dom.koBottomDock.classList.add('anim-rise-up');
  }

  const startT = performance.now();
  const dur = 550;
  const targetScore = state.score;
  const targetBest = state.highScore;
  const targetDist = Math.floor(state.distance);
  const targetFlies = state.fliesCaught;

  function tickRollup(now) {
    const p = Math.min(1, (now - startT) / dur);
    const ease = 1 - Math.pow(1 - p, 3);
    if (dom.finalScoreVal) dom.finalScoreVal.textContent = Math.round(targetScore * ease).toLocaleString();
    if (dom.finalBestVal) dom.finalBestVal.textContent = Math.round(targetBest * ease).toLocaleString();
    if (dom.finalDistVal) dom.finalDistVal.textContent = `${Math.round(targetDist * ease)}m`;
    if (dom.finalFliesVal) dom.finalFliesVal.textContent = String(Math.round(targetFlies * ease));
    if (p < 1 && state.status === 'gameover') requestAnimationFrame(tickRollup);
  }
  requestAnimationFrame(tickRollup);
}
