import { state } from './state.js';
import { SEASONS, ENV_CHUNK_LEN, saveHighScore } from './constants.js';
import { SoundFX } from './audio.js';
import { dom, updateHUD, revealAnimatedScorecard } from './ui.js';
import { spawnWaterRipple, spawn3DSplashBurst, spawnScorePopup } from './particles.js';
import { SHARED_GEO, frogBodyMat } from './materials.js';
import {
  entitiesGroup,
  createLilyPad3D,
  createCedarLog3D,
  createMossyRiverStone3D,
  createToadstoolMushroom3D,
  createWhirlpoolPad3D,
  createDragonfly3D,
  createStripedWasp3D,
  createToriiGate3D
} from './entities/environment.js';
import { frogRoot, frogSquashGroup } from './entities/frog.js';

const THREE = window.THREE;

let sceneRef = null;
let cameraRef = null;
let sunLightRef = null;
let hemiLightRef = null;
let riverMatRef = null;
let weatherMatRef = null;
let valleyChunksRef = null;

export function initGameContext(ctx) {
  sceneRef = ctx.scene;
  cameraRef = ctx.camera;
  sunLightRef = ctx.sunLight;
  hemiLightRef = ctx.hemiLight;
  riverMatRef = ctx.riverMat;
  weatherMatRef = ctx.weatherMat;
  valleyChunksRef = ctx.valleyChunks;
}

export function spawnNextRiverStep() {
  state.stepIndex++;
  const tier = Math.min(8, 1 + Math.floor(state.distance / 100));
  const spacing = 5.6 + Math.min(1.4, (tier - 1) * 0.2) + Math.random() * 1.65;
  state.lastSpawnZ -= spacing;
  const z = state.lastSpawnZ;

  const isSplit = Math.random() < Math.min(0.48, 0.22 + (tier - 1) * 0.04);
  const lanes = isSplit
    ? [-2.0 + (Math.random() - 0.5) * 0.4, 2.0 + (Math.random() - 0.5) * 0.4]
    : [(Math.random() - 0.5) * 3.8];

  const vortexChance = 0.20 + Math.min(0.12, (tier - 1) * 0.02);
  const logChance = 0.24;
  const mushChance = 0.20;
  const stoneChance = 0.12;

  lanes.forEach((x) => {
    const roll = Math.random();
    let plat;
    if (roll < vortexChance) plat = createWhirlpoolPad3D(x, z);
    else if (roll < vortexChance + logChance) plat = createCedarLog3D(x, z);
    else if (roll < vortexChance + logChance + mushChance) plat = createToadstoolMushroom3D(x, z);
    else if (roll < vortexChance + logChance + mushChance + stoneChance) plat = createMossyRiverStone3D(x, z);
    else plat = createLilyPad3D(x, z);

    plat.stepIndex = state.stepIndex;
    plat.freq1 *= (1 + (tier - 1) * 0.12);
    plat.ampX = Math.min(1.65, plat.ampX * (1 + (tier - 1) * 0.08));
    state.platforms.push(plat);
  });

  if (Math.random() < 0.65) {
    state.flies.push(createDragonfly3D((Math.random() - 0.5) * 4.6, z + spacing * 0.42));
  }
  if (state.stepIndex > 1 && Math.random() < Math.min(0.68, 0.34 + (tier - 1) * 0.05)) {
    state.wasps.push(createStripedWasp3D(0, z + spacing * 0.48));
  }
  if (state.stepIndex % 10 === 0) {
    state.gates.push(createToriiGate3D(z - 3.2));
  }
}

export function triggerShockwaveBlast(radiusScale = 1) {
  SoundFX.playShockwave();
  spawnWaterRipple(state.frogX, state.frogZ, 4.6 * radiusScale, 0.8);

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92
  });
  const mesh = new THREE.Mesh(SHARED_GEO.shockwaveRing, ringMat);
  mesh.position.set(state.frogX, 0.14, state.frogZ);
  if (sceneRef) sceneRef.add(mesh);
  state.shockwaves.push({ mesh, mat: ringMat, scale: 1, maxScale: 6.8 * radiusScale, alpha: 0.95 });

  const blastRadius = 7.2 * radiusScale;

  for (let i = state.wasps.length - 1; i >= 0; i--) {
    const w = state.wasps[i];
    if (Math.hypot(w.x - state.frogX, w.z - state.frogZ) <= blastRadius) {
      entitiesGroup.remove(w.group);
      state.wasps.splice(i, 1);
      state.score += 250;
      spawnScorePopup('💥 +250 HORNET BLASTED!', w.x, 1.6, w.z, '#38bdf8');
    }
  }

  for (const f of state.flies) {
    if (!f.caught && !f.snatchedByTongue && Math.hypot(f.x - state.frogX, f.z - state.frogZ) <= blastRadius * 1.25) {
      f.magnetized = true;
    }
  }
  updateHUD();
}

export function resetRiverWorld() {
  for (const p of state.platforms) entitiesGroup.remove(p.group);
  for (const f of state.flies) entitiesGroup.remove(f.group);
  for (const w of state.wasps) entitiesGroup.remove(w.group);
  for (const g of state.gates) entitiesGroup.remove(g.group);
  for (const sp of state.splashParticles) if (sceneRef) sceneRef.remove(sp.mesh);
  state.platforms = [];
  state.flies = [];
  state.wasps = [];
  state.gates = [];
  state.splashParticles = [];
  state.stepIndex = 0;

  if (valleyChunksRef && valleyChunksRef.length >= 2) {
    valleyChunksRef[0].position.z = 0;
    valleyChunksRef[1].position.z = -ENV_CHUNK_LEN;
  }
  const startPad = createLilyPad3D(0, 2);
  state.platforms.push(startPad);
  state.currentPlatform = startPad;

  state.lastSpawnZ = 2;
  for (let i = 0; i < 10; i++) spawnNextRiverStep();
}

export function applySeason(idx) {
  state.seasonIdx = idx % SEASONS.length;
  const s = SEASONS[state.seasonIdx];
  if (dom.seasonLabel) dom.seasonLabel.textContent = `${s.icon} ${s.name}`;
  if (sceneRef) {
    sceneRef.background.setHex(s.skyHex);
    sceneRef.fog.color.setHex(s.fogHex);
    sceneRef.fog.density = s.fogDensity;
  }
  if (riverMatRef) {
    riverMatRef.color.setHex(s.waterHex);
    riverMatRef.emissive.setHex(s.waterEmissive);
  }
  if (sunLightRef) {
    sunLightRef.color.setHex(s.sunHex);
    sunLightRef.intensity = s.sunIntensity;
  }
  if (hemiLightRef) {
    hemiLightRef.color.setHex(s.hemiSkyHex);
    hemiLightRef.groundColor.setHex(s.hemiGroundHex);
  }
  frogBodyMat.color.setHex(s.frogColor);
  if (weatherMatRef) {
    weatherMatRef.color.setHex(s.particleHex);
  }
}

export function initiateStartGameTransition() {
  SoundFX.init();
  SoundFX.playReadyLeap();
  state.status = 'transitioning';
  state.transitionTimer = 0;
  state.transitionDuration = 0.75;
  state.score = 0;
  state.distance = 0;
  state.fliesCaught = 0;
  state.streak = 1;
  state.comboTimer = 0;
  state.difficultyTier = 1;
  state.anchorZ = 2;
  state.lives = 3;
  state.invulnerableTimer = 0;
  state.logSlideOffset = 0;
  state.logSlideVel = 0;
  state.deathTimer = 0;
  state.camShake = 0;
  state.leapTargetPlatform = null;
  state.willSplashInWater = false;
  state.isLeaping = false;
  state.tongue.active = false;
  state.isCharging = false;

  applySeason(0);
  resetRiverWorld();
  updateHUD();

  if (dom.startOverlay) {
    dom.startOverlay.style.transition = 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    dom.startOverlay.style.opacity = '0';
    dom.startOverlay.style.pointerEvents = 'none';
    dom.startOverlay.style.transform = 'scale(1.04)';
    setTimeout(() => {
      dom.startOverlay.classList.add('hidden');
      dom.startOverlay.style.opacity = '';
      dom.startOverlay.style.pointerEvents = '';
      dom.startOverlay.style.transform = '';
    }, 460);
  }
  if (dom.gameHUD) dom.gameHUD.classList.remove('hidden');
  if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
  if (dom.gameOverModal) dom.gameOverModal.classList.add('hidden');
}

export function startNewGame() {
  if (state.status === 'start') {
    initiateStartGameTransition();
    return;
  }
  SoundFX.init();
  state.status = 'playing';
  state.transitionTimer = 0;
  state.score = 0;
  state.distance = 0;
  state.fliesCaught = 0;
  state.streak = 1;
  state.comboTimer = 0;
  state.difficultyTier = 1;
  state.anchorZ = 2;
  state.lives = 3;
  state.frogX = 0;
  state.frogY = 0.35;
  state.frogZ = 2;
  state.frogYaw = 0;
  state.frogPitch = 0;
  state.frogRoll = 0;
  state.invulnerableTimer = 0;
  state.logSlideOffset = 0;
  state.logSlideVel = 0;
  state.deathTimer = 0;
  state.camShake = 0;
  state.leapTargetPlatform = null;
  state.willSplashInWater = false;
  frogSquashGroup.visible = true;
  frogRoot.scale.setScalar(1.0);
  if (dom.sinkWarning) dom.sinkWarning.classList.add('hidden');
  state.isLeaping = false;
  state.tongue.active = false;
  state.isCharging = false;

  applySeason(0);
  resetRiverWorld();
  updateHUD();

  if (dom.startOverlay) dom.startOverlay.classList.add('hidden');
  if (dom.gameHUD) dom.gameHUD.classList.remove('hidden');
  if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
  if (dom.gameOverModal) dom.gameOverModal.classList.add('hidden');
}


export function triggerGameOver(reason, deathType = 'swept') {
  if (state.status === 'dying' || state.status === 'gameover') return;
  state.status = 'dying';
  state.deathType = deathType;
  state.deathTimer = 0;
  state.isLeaping = false;
  state.tongue.active = false;
  frogSquashGroup.visible = true;
  if (dom.sinkWarning) dom.sinkWarning.classList.add('hidden');

  if (state.score > state.highScore) {
    state.highScore = state.score;
    saveHighScore(state.score);
  }
  updateHUD();

  const meta = {
    vortex: { icon: '🌀', title: 'Swallowed by Whirlpool!', popup: '🌀 SUCKED INTO THE VORTEX!', color: '#38bdf8', dur: 1.55 },
    swept:  { icon: '🌊', title: 'Swept Downstream!',       popup: '🌊 SWEPT AWAY BY RAPIDS!',  color: '#60a5fa', dur: 1.55 },
    slip:   { icon: '🪵', title: 'Slipped Off the Log!',     popup: '🪵 WHOA! SLIPPED OFF!',     color: '#fbbf24', dur: 1.45 },
    splash: { icon: '💦', title: 'Plunged into the Abyss!',  popup: '💦 SPLASHED IN THE RIVER!', color: '#38bdf8', dur: 1.40 },
    submerge:{ icon: '🪨', title: 'Stone Sank Underwater!',   popup: '🫧 GLUB GLUB... SUNK!',     color: '#94a3b8', dur: 1.45 },
    sting:  { icon: '🐝', title: 'KO’d by Murder Hornets!', popup: '🐝 KNOCKED INTO THE RIVER!', color: '#f43f5e', dur: 1.50 }
  }[deathType] || { icon: '🌊', title: 'Swept Downstream!', popup: '🌊 SWEPT AWAY!', color: '#38bdf8', dur: 1.5 };

  state.deathDuration = meta.dur;
  state.camShake = 0.45;
  SoundFX.playSplash();
  SoundFX.playWipeoutGurgle();

  spawnWaterRipple(state.frogX, state.frogZ, 4.8, 0.9);
  spawnWaterRipple(state.frogX, state.frogZ, 3.0, 0.75);
  spawn3DSplashBurst(state.frogX, Math.max(0.15, state.frogY), state.frogZ, 26, deathType === 'vortex');
  spawnScorePopup(meta.popup, state.frogX, state.frogY + 1.1, state.frogZ, meta.color);

  if (deathType === 'slip') {
    const slideDir = Math.sign(state.logSlideOffset) || 1;
    state.deathVelX = slideDir * 4.2;
    state.deathVelY = 2.8;
    state.deathVelZ = 4.8;
  } else if (deathType === 'sting') {
    state.deathVelX = (Math.random() - 0.5) * 3.5;
    state.deathVelY = 4.2;
    state.deathVelZ = 5.5;
  } else if (deathType === 'swept') {
    state.deathVelX = (Math.random() - 0.5) * 1.8;
    state.deathVelY = 1.6;
    state.deathVelZ = 8.5;
  } else {
    state.deathVelX = 0;
    state.deathVelY = 1.2;
    state.deathVelZ = 3.2;
  }

  if (dom.gameOverIcon) dom.gameOverIcon.textContent = meta.icon;
  if (dom.gameOverTitle) dom.gameOverTitle.textContent = meta.title;
  if (dom.gameOverReason) dom.gameOverReason.textContent = reason || 'Carried away by the river current.';
}

const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();
const waterPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.15);
const flyPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.35);

export function findBestEntityAtPointer(clientX, clientY) {
  if (!dom.canvas || !cameraRef) return null;
  const rect = dom.canvas.getBoundingClientRect();
  pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, cameraRef);

  const flyHitPoint = new THREE.Vector3();
  const hasFlyPlaneHit = raycaster.ray.intersectPlane(flyPlane, flyHitPoint);
  let bestFly = null;
  let bestFlyDist = 2.35;
  const flyPos3D = new THREE.Vector3();

  for (const f of state.flies) {
    if (f.caught || f.snatchedByTongue || f.z > state.frogZ + 1.5 || f.z < state.frogZ - 20) continue;
    flyPos3D.set(f.x, f.y, f.z);
    const rayDist = raycaster.ray.distanceToPoint(flyPos3D);
    const planeDist = hasFlyPlaneHit ? Math.hypot(f.x - flyHitPoint.x, f.z - flyHitPoint.z) : Infinity;
    const d = Math.min(rayDist, planeDist);
    if (d < bestFlyDist) {
      bestFlyDist = d;
      bestFly = f;
    }
  }
  if (bestFly) return bestFly;

  const waterHitPoint = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(waterPlane, waterHitPoint)) return null;

  let bestPlat = null;
  let bestPlatDist = 3.6;
  for (const p of state.platforms) {
    if (p === state.currentPlatform || p.z >= state.frogZ - 0.3 || p.z < state.frogZ - 20) continue;
    const d = Math.hypot(p.x - waterHitPoint.x, p.z - waterHitPoint.z);
    if (d < bestPlatDist) {
      bestPlatDist = d;
      bestPlat = p;
    }
  }
  return bestPlat;
}

export function getForwardPlatform(stepsAhead = 1) {
  const forwardPlats = state.platforms
    .filter((p) => p !== state.currentPlatform && p.z < state.frogZ - 0.4 && p.z > state.frogZ - 26)
    .sort((a, b) => b.z - a.z);

  if (forwardPlats.length === 0) return null;

  const stepGroups = [];
  for (const p of forwardPlats) {
    const lastGroup = stepGroups[stepGroups.length - 1];
    if (!lastGroup || Math.abs(lastGroup[0].z - p.z) > 2.2) {
      stepGroups.push([p]);
    } else {
      lastGroup.push(p);
    }
  }

  const targetGroup = stepGroups[Math.min(stepGroups.length - 1, stepsAhead - 1)];
  if (!targetGroup) return forwardPlats[0];

  let best = targetGroup[0];
  let minDx = Math.abs(best.x - state.frogX);
  for (const cand of targetGroup) {
    const dx = Math.abs(cand.x - state.frogX);
    if (dx < minDx) {
      minDx = dx;
      best = cand;
    }
  }
  return best;
}

export function getNearestSnatchableFly() {
  let bestFly = null;
  let bestDist = 11.5;
  for (const f of state.flies) {
    if (f.caught || f.snatchedByTongue || f.z > state.frogZ + 1.5 || f.z < state.frogZ - 14) continue;
    const d = Math.hypot(f.x - state.frogX, f.z - state.frogZ);
    if (d < bestDist) {
      bestDist = d;
      bestFly = f;
    }
  }
  return bestFly;
}

export function triggerManualTongueSnatch(specificFly = null) {
  if (state.tongue.active || state.status !== 'playing') return;
  const fly = specificFly || getNearestSnatchableFly();
  SoundFX.playGrapple();
  state.jawOpen = 0.78;
  state.squashX = 1.24;
  state.squashY = 0.78;
  state.squashZ = 1.24;

  if (fly) {
    const dx = fly.x - state.frogX;
    const dz = fly.z - state.frogZ;
    state.frogYaw = Math.atan2(-dx, -dz);
    state.tongue.active = true;
    state.tongue.phase = 'extending';
    state.tongue.progress = 0;
    state.tongue.targetX = fly.x;
    state.tongue.targetY = fly.y;
    state.tongue.targetZ = fly.z;
    state.tongue.targetEntity = fly;
  } else {
    state.tongue.active = true;
    state.tongue.phase = 'extending';
    state.tongue.progress = 0;
    state.tongue.targetX = state.frogX - Math.sin(state.frogYaw) * 4.5;
    state.tongue.targetY = state.frogY + 0.8;
    state.tongue.targetZ = state.frogZ - Math.cos(state.frogYaw) * 4.5;
    state.tongue.targetEntity = null;
  }
}

export function triggerSkillLeap(targetPlat, isPointerAimed = false) {
  if (!targetPlat || state.isLeaping || state.status !== 'playing') return;

  if (state.currentPlatform) {
    state.currentPlatform.springVelY -= 2.2;
    spawnWaterRipple(state.frogX, state.frogZ, 2.5, 0.5);
  }

  const lateralError = Math.abs(targetPlat.x - state.frogX);
  const maxSafeOffset = targetPlat.type === 'log' ? 3.85 : 3.35;
  const missedAlignment = !isPointerAimed && lateralError > maxSafeOffset;

  state.isLeaping = true;
  state.leapProgress = 0;
  state.leapStartX = state.frogX;
  state.leapStartZ = state.frogZ;

  if (missedAlignment) {
    state.leapTargetX = state.frogX + Math.sign(targetPlat.x - state.frogX) * 1.35;
    state.leapTargetZ = targetPlat.z;
    state.leapTargetPlatform = null;
    state.willSplashInWater = true;
  } else {
    state.leapTargetX = targetPlat.x;
    state.leapTargetZ = targetPlat.z;
    state.leapTargetPlatform = targetPlat;
    state.willSplashInWater = false;
    state.landingSlideSeed = THREE.MathUtils.clamp((state.frogX - targetPlat.x) * 0.22, -0.42, 0.42);
  }

  const dx = state.leapTargetX - state.frogX;
  const dz = state.leapTargetZ - state.frogZ;
  state.frogYaw = Math.atan2(-dx, -dz);

  const jumpDist = Math.hypot(dx, dz);
  state.leapDuration = Math.max(0.28, Math.min(0.48, jumpDist * 0.045));
  state.leapPeakHeight = jumpDist > 8.5 ? 3.4 : 1.95;
  state.squashX = 0.76;
  state.squashY = 1.34;
  state.squashZ = 0.76;
  SoundFX.playGrapple();
}

export function triggerGrappleOrSnatch(entity, isPointerAimed = false) {
  if (!entity || state.status !== 'playing') return;
  if (entity.type === 'fly') {
    triggerManualTongueSnatch(entity);
  } else {
    triggerSkillLeap(entity, isPointerAimed);
  }
}
