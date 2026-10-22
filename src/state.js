import { getSavedHighScore } from './constants.js';

export const state = {
  status: 'start', // 'start' | 'playing' | 'dying' | 'paused' | 'gameover'
  seasonIdx: 0,
  score: 0,
  highScore: getSavedHighScore(),
  distance: 0,
  fliesCaught: 0,
  streak: 1,
  comboTimer: 0,
  maxComboTime: 3.6,
  difficultyTier: 1,
  anchorZ: 2,
  lives: 3,
  maxLives: 3,
  worldTime: 0,
  lastSpawnZ: 2,
  stepIndex: 0,

  frogX: 0,
  frogY: 0.35,
  frogZ: 2,
  frogYaw: 0,
  frogPitch: 0,
  frogRoll: 0,
  headTargetYaw: 0,
  headYaw: 0,
  blinkTimer: 2.5,
  isBlinking: false,
  squashX: 1,
  squashY: 1,
  squashZ: 1,
  jawOpen: 0,

  menuCamAngle: 0,

  isLeaping: false,
  leapProgress: 0,
  leapDuration: 0.38,
  leapStartX: 0,
  leapStartZ: 2,
  leapTargetX: 0,
  leapTargetZ: 2,
  leapPeakHeight: 2.1,
  leapTargetPlatform: null,
  willSplashInWater: false,
  landingSlideSeed: 0,
  logGraceTimer: 0,
  logSlideOffset: 0,
  logSlideVel: 0,

  // 3D Wipeout / Death Action Sequence State
  deathType: 'swept', // 'vortex' | 'swept' | 'slip' | 'splash' | 'sting' | 'submerge'
  deathTimer: 0,
  deathDuration: 1.55,
  deathVelX: 0,
  deathVelY: 0,
  deathVelZ: 0,
  camShake: 0,

  isCharging: false,
  chargePower: 0,
  shockwaves: [],
  waterRipples: [],
  splashParticles: [],

  tongue: {
    active: false,
    phase: 'idle',
    progress: 0,
    targetX: 0,
    targetY: 0.5,
    targetZ: -2,
    targetEntity: null
  },

  hoveredEntity: null,
  currentPlatform: null,
  invulnerableTimer: 0,
  platforms: [],
  flies: [],
  wasps: [],
  gates: []
};
