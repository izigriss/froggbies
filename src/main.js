import { state } from './state.js';
import {
  RIVER_HALF_WIDTH,
  ENV_CHUNK_LEN,
  SEASONS
} from './constants.js';
import { SoundFX } from './audio.js';
import { dom, updateHUD } from './ui.js';
import {
  TEX_WATER_BUMP,
  SHARED_MAT,
  SHARED_GEO,
  frogBodyMat
} from './materials.js';
import {
  entitiesGroup,
  environmentGroup,
  animatedSwayProps,
  animatedWaterfalls,
  buildValleyChunk
} from './entities/environment.js';
import {
  frogRoot,
  frogSquashGroup,
  frogHeadGroup,
  jawPivot,
  vocalSac,
  hindLegs,
  frogEyelids,
  tongueRibbonMesh,
  tongueTipGroup
} from './entities/frog.js';
import {
  initParticles,
  spawnWaterRipple,
  spawn3DSplashBurst,
  spawnScorePopup
} from './particles.js';
import {
  initGameContext,
  spawnNextRiverStep,
  triggerShockwaveBlast,
  resetRiverWorld,
  applySeason,
  startNewGame,
  triggerGameOver,
  findBestEntityAtPointer,
  getForwardPlatform,
  triggerManualTongueSnatch,
  triggerSkillLeap,
  triggerGrappleOrSnatch
} from './game.js';

const THREE = window.THREE;

let W = window.innerWidth;
let H = window.innerHeight;
let animId = null;
let lastTime = 0;

// Three.js Setup
const renderer = new THREE.WebGLRenderer({
  canvas: dom.canvas,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(W, H, false);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const initialSeason = SEASONS[0];
scene.background = new THREE.Color(initialSeason.skyHex);
scene.fog = new THREE.FogExp2(initialSeason.fogHex, initialSeason.fogDensity);

const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 145);
camera.position.set(0, 4.5, 7.5);
camera.lookAt(0, 1.2, 1.5);

const hemiLight = new THREE.HemisphereLight(initialSeason.hemiSkyHex, initialSeason.hemiGroundHex, 0.85);
hemiLight.position.set(0, 30, 0);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(initialSeason.sunHex, initialSeason.sunIntensity);
sunLight.position.set(16, 28, 14);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 2;
sunLight.shadow.camera.far = 65;
const d = 18;
sunLight.shadow.camera.left = -d;
sunLight.shadow.camera.right = d;
sunLight.shadow.camera.top = d;
sunLight.shadow.camera.bottom = -d;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);
scene.add(sunLight.target);

const riverFocusLight = new THREE.PointLight(0x7dd3fc, 0.85, 25, 1.5);
riverFocusLight.position.set(0, 4.5, 0);
scene.add(riverFocusLight);

// River Mesh
const riverBedGeo = new THREE.PlaneGeometry(RIVER_HALF_WIDTH * 2 + 6.0, ENV_CHUNK_LEN * 2, 36, 96);
riverBedGeo.rotateX(-Math.PI / 2);
const riverMat = new THREE.MeshStandardMaterial({
  color: initialSeason.waterHex,
  emissive: initialSeason.waterEmissive,
  emissiveIntensity: 0.35,
  bumpMap: TEX_WATER_BUMP,
  bumpScale: 0.08,
  roughness: 0.12,
  metalness: 0.65
});
const riverMesh = new THREE.Mesh(riverBedGeo, riverMat);
riverMesh.receiveShadow = true;
scene.add(riverMesh);

// Groups & Entities in Scene
scene.add(environmentGroup);
scene.add(entitiesGroup);
scene.add(frogRoot);
scene.add(tongueRibbonMesh);
scene.add(tongueTipGroup);

// Valley Chunks
const valleyChunks = [];
valleyChunks.push(buildValleyChunk(0));
valleyChunks.push(buildValleyChunk(1));

// Weather Particles
const weatherGroup = new THREE.Group();
scene.add(weatherGroup);
const weatherParticles = [];
const weatherMat = new THREE.MeshBasicMaterial({ color: initialSeason.particleHex, transparent: true, opacity: 0.8 });
const weatherGeo = new THREE.OctahedronGeometry(0.09, 0);

for (let i = 0; i < 55; i++) {
  const p = new THREE.Mesh(weatherGeo, weatherMat);
  const rx = (Math.random() - 0.5) * 14;
  const ry = 0.6 + Math.random() * 7;
  const rz = (Math.random() - 0.5) * 40;
  p.position.set(rx, ry, rz);
  weatherGroup.add(p);
  weatherParticles.push({
    mesh: p,
    offsetX: rx,
    offsetY: ry,
    offsetZ: rz,
    phase: Math.random() * Math.PI * 2,
    speed: 0.8 + Math.random() * 1.2
  });
}

// Initialize Cross-Module References
initParticles(scene, camera, dom.popupLayer);
initGameContext({
  scene,
  camera,
  sunLight,
  hemiLight,
  riverMat,
  weatherMat,
  valleyChunks
});

// Simulation Loop
function updateGame(dt) {
  state.worldTime += dt;

  if (state.status === 'playing') {
    const newTier = Math.min(8, 1 + Math.floor(state.distance / 100));
    if (newTier > state.difficultyTier) {
      state.difficultyTier = newTier;
      SoundFX.playBullseye();
      spawnScorePopup(`⚡ RAPIDS LVL ${newTier}!`, state.frogX, 2.2, state.frogZ, '#38bdf8');
      updateHUD();
    }
    if (state.comboTimer > 0) {
      state.comboTimer = Math.max(0, state.comboTimer - dt * (1 + (state.difficultyTier - 1) * 0.06));
      if (dom.comboTimerBar) dom.comboTimerBar.style.width = `${(state.comboTimer / state.maxComboTime) * 100}%`;
      if (state.comboTimer === 0 && state.streak > 1) {
        state.streak = 1;
        updateHUD();
      }
    } else if (dom.comboTimerBar) {
      dom.comboTimerBar.style.width = '0%';
    }
  }

  state.squashX += (1 - state.squashX) * Math.min(1, dt * 11);
  state.squashY += (1 - state.squashY) * Math.min(1, dt * 11);
  state.squashZ += (1 - state.squashZ) * Math.min(1, dt * 11);

  state.blinkTimer -= dt;
  if (state.blinkTimer <= 0) {
    if (!state.isBlinking) {
      state.isBlinking = true;
      state.blinkTimer = 0.13;
      frogEyelids.forEach((el) => {
        el.visible = true;
        el.scale.y = 1.0;
      });
    } else {
      state.isBlinking = false;
      state.blinkTimer = 2.4 + Math.random() * 3.2;
      frogEyelids.forEach((el) => {
        el.visible = false;
      });
    }
  }

  const lookEntity = state.hoveredEntity || state.flies.find((f) => !f.caught && f.z < state.frogZ && f.z > state.frogZ - 12);
  if (lookEntity && !state.isLeaping && state.status === 'playing') {
    const targetAngle = Math.atan2(-(lookEntity.x - state.frogX), -(lookEntity.z - state.frogZ));
    let diff = targetAngle - state.frogYaw;
    diff = Math.max(-0.48, Math.min(0.48, diff));
    state.headTargetYaw = diff * 0.6;
  } else {
    state.headTargetYaw = 0;
  }
  state.headYaw += (state.headTargetYaw - state.headYaw) * Math.min(1, dt * 8);
  frogHeadGroup.rotation.y = state.headYaw;

  TEX_WATER_BUMP.offset.y -= dt * 0.35;
  const posAttr = riverBedGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vz = posAttr.getZ(i) + state.frogZ;
    posAttr.setY(i, Math.sin(vz * 0.35 + state.worldTime * 2.8) * 0.055 + Math.cos(vx * 0.75 + state.worldTime * 2.1) * 0.04);
  }
  posAttr.needsUpdate = true;

  for (const chunk of valleyChunks) {
    if (chunk.position.z - state.frogZ > ENV_CHUNK_LEN * 0.85) chunk.position.z -= ENV_CHUNK_LEN * 2;
  }

  const windGust = Math.sin(state.worldTime * 0.9) * 0.4 + 0.6;
  for (const sp of animatedSwayProps) {
    const w = Math.sin(state.worldTime * sp.speed + sp.phase) * sp.amp * windGust;
    sp.obj.rotation.z = sp.baseRotZ + w;
  }

  for (const wf of animatedWaterfalls) {
    for (const m of wf.mists) {
      m.mesh.scale.setScalar(0.75 + Math.sin(state.worldTime * 4.5 + m.phase) * 0.35);
      m.mesh.position.y = 0.22 + ((state.worldTime * 0.8 + m.phase) % 0.9);
    }
  }

  let showSinkAlert = false;
  if (state.status === 'playing' && !state.isLeaping && state.currentPlatform && state.distance > 12) {
    const currentDragSpeed = 0.42 + (state.difficultyTier - 1) * 0.14;
    state.currentPlatform.baseZ += currentDragSpeed * dt;
    if (state.currentPlatform.baseZ - state.anchorZ > 1.7) showSinkAlert = true;
    if (state.currentPlatform.baseZ - state.anchorZ > 3.4) {
      triggerGameOver('Swept backward by the rushing rapids!', 'swept');
      return;
    }
  }

  for (const p of state.platforms) {
    const driftX = Math.sin(state.worldTime * p.freq1 + p.phase1) * p.ampX;
    p.x = Math.max(-3.3, Math.min(3.3, p.baseX + driftX));
    p.z = p.baseZ;

    const springK = 32;
    const damping = 5.5;
    p.springVelY += (-springK * p.springY - damping * p.springVelY) * dt;
    p.springY += p.springVelY * dt;

    if (p.type === 'vortex') {
      p.group.rotation.y += p.rotSpeed * dt;
    }

    if (p.type === 'vortex' && state.currentPlatform === p && !state.isLeaping && state.status === 'playing') {
      p.vortexTimer = (p.vortexTimer || 0) + dt;
      p.sinkOffset = -(p.vortexTimer / 1.25) * 0.55;
      showSinkAlert = true;
      if (Math.random() < 0.45) spawnWaterRipple(p.x, p.z, 2.1, 0.55);
      if (p.vortexTimer >= 1.25) {
        triggerGameOver('Sucked into a spinning Whirlpool Vortex! Leap off vortex pads quickly!', 'vortex');
        return;
      }
    } else if (p.type === 'stone' && state.currentPlatform === p && !state.isLeaping && state.status === 'playing') {
      p.sinkOffset -= dt * 0.20;
      if (p.sinkOffset < -0.12) showSinkAlert = true;
      if (p.sinkOffset < -0.48) {
        triggerGameOver('The mossy stone submerged under your weight!', 'submerge');
        return;
      }
    } else {
      p.vortexTimer = 0;
      p.sinkOffset = Math.min(0, p.sinkOffset + dt * 0.25);
    }
    p.group.position.set(p.x, p.baseY + p.springY + p.sinkOffset, p.z);
  }

  if (!state.isLeaping && state.currentPlatform && state.status === 'playing') {
    const curPlat = state.currentPlatform;
    if (curPlat.type === 'log') {
      state.logGraceTimer = (state.logGraceTimer || 0) + dt;
      const graceFactor = Math.min(1, Math.max(0, (state.logGraceTimer - 0.35) / 0.6));
      const pushDir = Math.abs(state.logSlideOffset) < 0.04 ? (Math.sin(state.worldTime * 2.5) >= 0 ? 1 : -1) : Math.sign(state.logSlideOffset);
      const slipAccel = pushDir * (0.55 + Math.abs(state.logSlideOffset) * 1.15) * graceFactor;
      state.logSlideVel += slipAccel * dt;
      state.logSlideVel *= 0.96;
      state.logSlideOffset += state.logSlideVel * dt;

      curPlat.group.rotation.z = -state.logSlideOffset * 0.14;

      if (Math.abs(state.logSlideOffset) > 0.85) {
        showSinkAlert = true;
      }
      if (Math.abs(state.logSlideOffset) > 1.78) {
        triggerGameOver('Slipped off the wet Cedar Log! Tap A/D or Leap before sliding to the edge!', 'slip');
        return;
      }
      state.frogX = curPlat.x + state.logSlideOffset;
    } else {
      curPlat.group.rotation.z = 0;
      state.frogX = curPlat.x;
    }

    if (curPlat.type === 'vortex') {
      state.frogYaw += curPlat.rotSpeed * dt;
    }

    state.frogZ = curPlat.z;
    state.frogY = curPlat.group.position.y + 0.26;
  }

  if (showSinkAlert && dom.sinkWarning) dom.sinkWarning.classList.remove('hidden');
  else if (dom.sinkWarning) dom.sinkWarning.classList.add('hidden');

  for (const f of state.flies) {
    if (f.caught) continue;
    f.wingPhase += dt * 52;
    const flap = Math.sin(f.wingPhase) * 0.65;
    f.leftWing.rotation.z = flap;
    f.rightWing.rotation.z = -flap;
    if (f.leftHindWing) f.leftHindWing.rotation.z = -flap * 0.85;
    if (f.rightHindWing) f.rightHindWing.rotation.z = flap * 0.85;

    if (f.magnetized && !f.snatchedByTongue) {
      f.x += (state.frogX - f.x) * Math.min(1, dt * 11);
      f.y += (state.frogY + 0.5 - f.y) * Math.min(1, dt * 11);
      f.z += (state.frogZ - f.z) * Math.min(1, dt * 11);
      f.group.position.set(f.x, f.y, f.z);
      if (Math.hypot(f.x - state.frogX, f.z - state.frogZ) < 0.75) {
        f.caught = true;
        entitiesGroup.remove(f.group);
        state.fliesCaught++;
        state.streak = Math.min(10, state.streak + 1);
        state.comboTimer = state.maxComboTime;
        const pts = f.points * Math.min(5, state.streak);
        state.score += pts;
        SoundFX.playCatch();
        spawnScorePopup(`🧲 +${pts} MAGNETIZED!`, f.x, f.y + 0.6, f.z, '#fde047');
        updateHUD();
      }
    } else if (!f.snatchedByTongue) {
      f.flightTime += dt;
      const prevX = f.x;
      const prevY = f.y;
      const prevZ = f.z;

      if (!f.hasPaused && Math.abs(f.x - f.pauseX) < 0.32) {
        f.hasPaused = true;
        f.hoverTimer = 0.85 + Math.random() * 0.9;
      }

      if (f.hoverTimer > 0) {
        f.hoverTimer -= dt;
        f.x += Math.sin(f.flightTime * 5.0) * 0.25 * dt;
        f.z = f.baseZ + Math.cos(f.flightTime * 3.5) * 0.22;
        f.y = f.baseY + Math.sin(f.flightTime * 7.5) * 0.08;
      } else {
        f.x += f.dir * f.speedX * dt;
        f.z = f.baseZ + Math.sin(f.flightTime * 2.2) * 0.65;
        f.y = f.baseY + Math.sin(f.flightTime * 3.8) * 0.24;

        if (Math.abs(f.x) > RIVER_HALF_WIDTH + 3.8) {
          f.dir = Math.random() < 0.5 ? 1 : -1;
          f.x = -f.dir * (RIVER_HALF_WIDTH + 3.6);
          f.baseY = 1.15 + Math.random() * 0.65;
          f.pauseX = (Math.random() - 0.5) * 3.4;
          f.hasPaused = false;
          f.speedX = 2.1 + Math.random() * 1.4;
        }
      }

      const edgeVisibility = THREE.MathUtils.clamp((RIVER_HALF_WIDTH + 3.6 - Math.abs(f.x)) / 1.8, 0.01, 1.0);
      f.group.scale.setScalar(edgeVisibility);
      f.group.position.set(f.x, f.y, f.z);

      const vx = f.x - prevX;
      const vz = f.z - prevZ;
      const vy = f.y - prevY;
      if (Math.hypot(vx, vz) > 0.002) {
        const targetYaw = Math.atan2(-vx, -vz);
        let diff = targetYaw - f.group.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        f.group.rotation.y += diff * Math.min(1, dt * 10);
        f.group.rotation.x = THREE.MathUtils.clamp(vy * 3.5, -0.35, 0.35);
        f.group.rotation.z = THREE.MathUtils.clamp(-diff * 0.45, -0.45, 0.45);
      }
    }
  }

  for (const w of state.wasps) {
    w.phase += dt * 3.2;
    const prevX = w.x;
    const prevY = w.y;
    const prevZ = w.z;

    w.x += w.dir * w.speedX * dt;
    w.z = w.baseZ + Math.sin(w.phase * 0.85) * 0.72;
    w.y = 1.12 + Math.sin(w.phase * 1.6) * 0.26;

    if (Math.abs(w.x) > RIVER_HALF_WIDTH + 4.2) {
      w.dir = -w.dir;
      w.x = -w.dir * (RIVER_HALF_WIDTH + 4.0);
      w.speedX = 2.8 + Math.random() * 1.45;
    }

    const edgeVisibility = THREE.MathUtils.clamp((RIVER_HALF_WIDTH + 4.0 - Math.abs(w.x)) / 1.8, 0.01, 1.0);
    w.group.scale.setScalar(edgeVisibility);
    w.group.position.set(w.x, w.y, w.z);

    const vx = w.x - prevX;
    const vz = w.z - prevZ;
    const vy = w.y - prevY;
    if (Math.hypot(vx, vz) > 0.002) {
      const targetYaw = Math.atan2(-vx, -vz);
      let diff = targetYaw - w.group.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      w.group.rotation.y += diff * Math.min(1, dt * 12);
      w.group.rotation.x = -0.18 + THREE.MathUtils.clamp(vy * 3.0, -0.3, 0.3);
      w.group.rotation.z = THREE.MathUtils.clamp(-diff * 0.5, -0.5, 0.5);
    }

    w.leftWing.rotation.z = Math.sin(w.phase * 16) * 0.72;
    w.rightWing.rotation.z = -Math.sin(w.phase * 16) * 0.72;
  }

  for (const g of state.gates) g.portalRing.rotation.z = state.worldTime * 1.2;

  for (let i = state.shockwaves.length - 1; i >= 0; i--) {
    const sw = state.shockwaves[i];
    sw.scale += dt * 15;
    sw.alpha -= dt * 2.1;
    sw.mesh.scale.setScalar(sw.scale);
    sw.mat.opacity = Math.max(0, sw.alpha);
    if (sw.alpha <= 0) {
      scene.remove(sw.mesh);
      state.shockwaves.splice(i, 1);
    }
  }

  for (let i = state.waterRipples.length - 1; i >= 0; i--) {
    const rp = state.waterRipples[i];
    rp.scale += dt * 3.2;
    rp.alpha -= dt * 0.75;
    rp.mesh.scale.setScalar(rp.scale);
    rp.mat.opacity = Math.max(0, rp.alpha);
    if (rp.alpha <= 0 || rp.scale >= rp.maxScale) {
      scene.remove(rp.mesh);
      rp.mat.dispose();
      state.waterRipples.splice(i, 1);
    }
  }

  for (let i = state.splashParticles.length - 1; i >= 0; i--) {
    const sp = state.splashParticles[i];
    sp.life += dt;
    if (sp.isBubble) {
      sp.mesh.position.y += dt * 1.4;
      sp.mesh.position.x += Math.sin(state.worldTime * 8 + i) * dt * 0.5;
      sp.mesh.position.z += dt * 1.8;
    } else {
      sp.vy -= 12.5 * dt;
      sp.mesh.position.x += sp.vx * dt;
      sp.mesh.position.y += sp.vy * dt;
      sp.mesh.position.z += sp.vz * dt;
    }
    const ratio = Math.max(0, 1 - sp.life / sp.maxLife);
    sp.mesh.scale.setScalar(ratio * 0.9);
    if (sp.life >= sp.maxLife || sp.mesh.position.y < -1.5) {
      scene.remove(sp.mesh);
      state.splashParticles.splice(i, 1);
    }
  }

  if (state.status === 'dying' || state.status === 'gameover') {
    state.deathTimer += dt;
    state.camShake = Math.max(0, state.camShake - dt * 1.1);

    if (state.deathType === 'vortex') {
      const p = Math.min(1, state.deathTimer / 1.15);
      const swirlRadius = (1 - p) * 0.85;
      const centerPlatX = state.currentPlatform ? state.currentPlatform.x : state.frogX;
      const centerPlatZ = state.currentPlatform ? state.currentPlatform.z : state.frogZ;
      state.frogYaw += dt * 22;
      state.frogPitch = p * 0.9;
      state.frogRoll = Math.sin(state.deathTimer * 18) * 0.65;
      state.frogX = centerPlatX + Math.cos(state.deathTimer * 18) * swirlRadius;
      state.frogZ = centerPlatZ + Math.sin(state.deathTimer * 18) * swirlRadius + state.deathTimer * 1.6;
      state.frogY = 0.25 - p * 1.85;
      frogRoot.scale.setScalar(Math.max(0.08, 1 - p * 0.92));
      if (Math.random() < 0.45) {
        spawnWaterRipple(state.frogX, state.frogZ, 2.2, 0.55);
      }
    } else if (state.deathType === 'slip' || state.deathType === 'sting') {
      state.deathVelY -= 11.5 * dt;
      state.frogX += state.deathVelX * dt;
      state.frogY += state.deathVelY * dt;
      state.frogZ += state.deathVelZ * dt;
      state.frogRoll += dt * 9.5;
      state.frogPitch += dt * 6.5;

      if (state.frogY < -0.18) {
        if (state.deathVelY < -2.0) {
          spawnWaterRipple(state.frogX, state.frogZ, 3.6, 0.75);
          spawn3DSplashBurst(state.frogX, 0.1, state.frogZ, 12, false);
        }
        state.frogY = -0.18 + Math.sin(state.worldTime * 6) * 0.08;
        state.deathVelY = 0;
        state.deathVelX *= 0.92;
        state.deathVelZ = 5.2;
        state.frogYaw += dt * 4.5;
      }
    } else {
      state.frogX += Math.sin(state.worldTime * 5.5) * dt * 1.4;
      state.frogZ += state.deathVelZ * dt;
      const targetSubmergeY = -0.22 + Math.sin(state.worldTime * 7) * 0.09;
      state.frogY += (targetSubmergeY - state.frogY) * Math.min(1, dt * 5.5);
      state.frogYaw += dt * 6.8;
      state.frogPitch = Math.sin(state.worldTime * 8) * 0.55;
      state.frogRoll = Math.cos(state.worldTime * 6.5) * 0.75;
      hindLegs.forEach((leg, idx) => {
        leg.rotation.x = Math.sin(state.worldTime * 22 + idx * Math.PI) * 1.1;
      });
      if (Math.random() < 0.35) {
        spawnWaterRipple(state.frogX, state.frogZ, 2.5, 0.5);
      }
    }

    if (state.status === 'dying' && state.deathTimer >= state.deathDuration) {
      state.status = 'gameover';
      dom.revealAnimatedScorecard?.() || null;
    }
    return;
  }

  if (state.status !== 'playing') return;

  if (state.invulnerableTimer > 0) {
    state.invulnerableTimer -= dt;
    frogSquashGroup.visible = Math.floor(state.invulnerableTimer * 12) % 2 === 0;
  } else {
    frogSquashGroup.visible = true;
    for (let i = state.wasps.length - 1; i >= 0; i--) {
      const w = state.wasps[i];
      if (Math.hypot(w.x - state.frogX, w.z - state.frogZ) < 1.08 && Math.abs(w.y - state.frogY) < 1.05) {
        entitiesGroup.remove(w.group);
        state.wasps.splice(i, 1);
        state.lives--;
        state.invulnerableTimer = 1.5;
        state.streak = 1;
        state.comboTimer = 0;
        SoundFX.playSting();
        spawnScorePopup('🐝 MURDER HORNET! -1 ❤️', state.frogX, state.frogY + 1.1, state.frogZ, '#f43f5e');
        updateHUD();
        if (state.lives <= 0) {
          triggerGameOver('Stung by patrolling Murder Hornets!', 'sting');
          return;
        }
      }
    }
  }

  if (state.tongue.active) {
    const target = state.tongue.targetEntity;
    if (target) {
      state.tongue.targetX = target.x;
      state.tongue.targetY = target.y;
      state.tongue.targetZ = target.z;
    }
    const speed = state.tongue.phase === 'extending' ? 9.5 : 10.5;
    state.tongue.progress += dt * speed;

    if (state.tongue.phase === 'extending' && state.tongue.progress >= 1) {
      if (target && target.type === 'fly' && !target.caught) {
        target.caught = true;
        entitiesGroup.remove(target.group);
        state.fliesCaught++;
        state.streak = Math.min(10, state.streak + 1);
        state.comboTimer = state.maxComboTime;
        const pts = target.points * Math.min(5, state.streak);
        state.score += pts;
        SoundFX.playCatch();
        spawnScorePopup(`🎯 +${pts} SNATCH!`, state.frogX, state.frogY + 1.3, state.frogZ, '#fde047');
        if (state.streak >= 5) {
          triggerShockwaveBlast(1.0);
        }
        updateHUD();
      }
      state.tongue.phase = 'retracting';
      state.tongue.progress = 0;
    } else if (state.tongue.phase === 'retracting' && state.tongue.progress >= 1) {
      state.tongue.active = false;
      state.tongue.targetEntity = null;
      state.jawOpen = 0;
    }
  }

  if (state.isLeaping) {
    state.leapProgress += dt / state.leapDuration;
    const p = Math.min(1, state.leapProgress);

    const landedTarget = state.leapTargetPlatform;
    if (landedTarget && !state.willSplashInWater) {
      state.leapTargetX = landedTarget.x + (state.landingSlideSeed || 0);
      state.leapTargetZ = landedTarget.z;
    }

    state.frogX = THREE.MathUtils.lerp(state.leapStartX, state.leapTargetX, p);
    state.frogZ = THREE.MathUtils.lerp(state.leapStartZ, state.leapTargetZ, p);
    state.frogY = 0.35 + Math.sin(p * Math.PI) * state.leapPeakHeight;
    state.frogPitch = Math.cos(p * Math.PI) * 0.48;

    const kickAngle = -Math.sin(p * Math.PI) * 0.95;
    hindLegs.forEach((leg) => {
      leg.rotation.x = kickAngle;
    });

    for (const g of state.gates) {
      if (!g.passed && state.frogZ <= g.z) {
        g.passed = true;
        applySeason(state.seasonIdx + 1);
        state.score += 500;
        SoundFX.playShockwave();
        spawnScorePopup(`⛩️ ${SEASONS[state.seasonIdx].name}! +500`, 0, 2.6, g.z, '#38bdf8');
        updateHUD();
      }
    }

    if (p >= 1) {
      state.isLeaping = false;
      state.frogPitch = 0;
      hindLegs.forEach((leg) => {
        leg.rotation.x = 0;
      });

      if (state.willSplashInWater || !landedTarget) {
        triggerGameOver('Missed the platform! Wait until the pad or log drifts into your lane!', 'splash');
        return;
      }

      const gainedMeters = Math.max(0, Math.round((2 - state.frogZ) * 2.2));
      if (gainedMeters > state.distance) state.distance = gainedMeters;

      state.streak = state.comboTimer > 0 ? Math.min(10, state.streak + 1) : 1;
      state.comboTimer = state.maxComboTime;

      state.currentPlatform = landedTarget;
      state.anchorZ = landedTarget.baseZ;
      landedTarget.springVelY = -3.4;
      SoundFX.playSplash();
      spawnWaterRipple(landedTarget.x, landedTarget.z, 3.1, 0.65);

      if (landedTarget.type === 'log') {
        state.logGraceTimer = 0;
        state.logSlideOffset = state.landingSlideSeed || (Math.random() < 0.5 ? -0.14 : 0.14);
        state.logSlideVel = Math.sign(state.logSlideOffset) * 0.28;
        spawnScorePopup('🪵 SLIPPERY LOG! (A/D Balance)', landedTarget.x, 1.45, landedTarget.z, '#fbbf24');
      } else {
        state.logGraceTimer = 0;
        state.logSlideOffset = 0;
        state.logSlideVel = 0;
        state.frogX = landedTarget.x;
      }

      if (landedTarget.type === 'vortex') {
        landedTarget.vortexTimer = 0;
        spawnScorePopup('🌀 WHIRLPOOL! LEAP QUICKLY!', landedTarget.x, 1.55, landedTarget.z, '#38bdf8');
      }

      state.frogZ = landedTarget.z;
      state.frogY = landedTarget.group.position.y + 0.26;

      const pts = (landedTarget.type === 'mushroom' ? 150 : 75) * Math.min(5, state.streak);
      state.score += pts;
      spawnScorePopup(`+${pts}`, state.frogX, 1.0, state.frogZ, '#a7f3d0');

      if (state.streak >= 5) {
        triggerShockwaveBlast(1.1);
        spawnScorePopup('🔥 5x FEVER SHOCKWAVE!', state.frogX, 2.1, state.frogZ, '#f43f5e');
      }

      while (state.lastSpawnZ > state.frogZ - 68) spawnNextRiverStep();
      updateHUD();

      if (landedTarget.type === 'mushroom') {
        const twoStepsTarget = getForwardPlatform(2) || getForwardPlatform(1);
        if (twoStepsTarget) {
          SoundFX.playBullseye();
          spawnScorePopup('🍄 SUPER SPRINGBOARD! (2X LEAP!)', state.frogX, 1.9, state.frogZ, '#f43f5e');
          triggerSkillLeap(twoStepsTarget, true);
        }
      }
    }
  }
}

// Render Loop
function renderGame() {
  if (state.status === 'start') {
    const bob = Math.sin(state.worldTime * 2.2) * 0.035;
    camera.position.set(-0.92 + Math.sin(state.worldTime * 0.45) * 0.16, 2.38, 6.65);
    camera.lookAt(0.28, 0.88, -1.5);

    frogRoot.position.set(1.52, 0.25 + bob, 2.35);
    frogRoot.scale.setScalar(1.36);
    frogSquashGroup.scale.set(
      1 + Math.sin(state.worldTime * 3.0) * 0.018,
      1 - Math.sin(state.worldTime * 3.0) * 0.018,
      1 + Math.sin(state.worldTime * 3.0) * 0.018
    );
    jawPivot.rotation.x = 0;

    frogHeadGroup.rotation.y = Math.sin(state.worldTime * 1.1) * 0.16;
    frogRoot.rotation.set(
      0.03 + Math.sin(state.worldTime * 1.8) * 0.015,
      2.58 + Math.sin(state.worldTime * 0.75) * 0.10,
      0
    );
    const breath = 1 + Math.pow(Math.sin(state.worldTime * 3.4) * 0.5 + 0.5, 2) * 0.32;
    vocalSac.scale.set(1.05 * breath, 0.52 * breath, 1.05 * breath);
  } else {
    if (state.status !== 'dying' && state.status !== 'gameover') {
      const curScale = frogRoot.scale.x;
      frogRoot.scale.setScalar(curScale + (1.0 - curScale) * 0.16);
    }
    frogRoot.position.set(state.frogX, state.frogY, state.frogZ);
    frogRoot.rotation.set(state.frogPitch, state.frogYaw, state.frogRoll);
    frogSquashGroup.scale.set(state.squashX, state.squashY, state.squashZ);
    jawPivot.rotation.x = -state.jawOpen;

    const breath = 1 + Math.pow(Math.sin(state.worldTime * 4.0) * 0.5 + 0.5, 2) * 0.28;
    vocalSac.scale.set(1.05 * breath, 0.52 * breath, 1.05 * breath);

    riverMesh.position.z = state.frogZ - 20;
    sunLight.position.set(state.frogX + 16, 28, state.frogZ + 12);

    if (state.tongue.active) {
      const extFactor = state.tongue.progress;
      const mouthOrigin = new THREE.Vector3(state.frogX, state.frogY + 0.42, state.frogZ - 0.55);
      const fullTarget = new THREE.Vector3(state.tongue.targetX, state.tongue.targetY, state.tongue.targetZ);
      const currentTip = new THREE.Vector3().lerpVectors(mouthOrigin, fullTarget, Math.max(0.05, extFactor));
      const dist = mouthOrigin.distanceTo(currentTip);
      const midPoint = new THREE.Vector3().addVectors(mouthOrigin, currentTip).multiplyScalar(0.5);

      tongueRibbonMesh.visible = true;
      tongueRibbonMesh.position.copy(midPoint);
      tongueRibbonMesh.scale.set(1, 1, Math.max(0.05, dist));
      tongueRibbonMesh.lookAt(currentTip);
      tongueTipGroup.visible = true;
      tongueTipGroup.position.copy(currentTip);
    } else {
      tongueRibbonMesh.visible = false;
      tongueTipGroup.visible = false;
    }

    const isWipeout = state.status === 'dying' || state.status === 'gameover';
    const shakeX = state.camShake > 0 ? (Math.random() - 0.5) * state.camShake : 0;
    const shakeY = state.camShake > 0 ? (Math.random() - 0.5) * state.camShake : 0;

    const targetCamX = (isWipeout ? state.frogX * 0.65 : state.frogX * 0.42) + shakeX;
    const targetCamZ = state.frogZ + (isWipeout ? 6.4 : 9.2);
    const targetCamY = (isWipeout ? 4.8 : 7.4 + (state.isLeaping ? state.frogY * 0.25 : 0)) + shakeY;

    camera.position.x += (targetCamX - camera.position.x) * 0.09;
    camera.position.z += (targetCamZ - camera.position.z) * 0.11;
    camera.position.y += (targetCamY - camera.position.y) * 0.09;

    const lookZ = isWipeout ? state.frogZ - 0.6 : state.frogZ - 4.2;
    camera.lookAt(state.frogX * 0.4, isWipeout ? 0.1 : 0.55, lookZ);
  }

  renderer.render(scene, camera);
}

function animate(now) {
  animId = requestAnimationFrame(animate);
  if (!lastTime) lastTime = now;
  const dt = Math.min(0.08, (now - lastTime) / 1000);
  lastTime = now;

  if (state.status === 'playing' || state.status === 'dying' || state.status === 'gameover') {
    updateGame(dt);
  } else {
    updateGame(dt * 0.5);
  }
  renderGame();
}

// Event Listeners
if (dom.startGameBtn) {
  dom.startGameBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startNewGame();
  });
}
if (dom.playAgainBtn) {
  dom.playAgainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startNewGame();
  });
}
if (dom.menuGuideBtn) {
  dom.menuGuideBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dom.pauseModal) dom.pauseModal.classList.remove('hidden');
  });
}
if (dom.menuAudioBtn) {
  dom.menuAudioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    SoundFX.muted = !SoundFX.muted;
    dom.menuAudioBtn.innerHTML = SoundFX.muted ? '<span>🔇</span> SOUND OFF' : '<span>🔊</span> SOUND ON';
    if (dom.muteBtn) dom.muteBtn.textContent = SoundFX.muted ? '🔇' : '🔊';
  });
}
if (dom.muteBtn) {
  dom.muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    SoundFX.muted = !SoundFX.muted;
    dom.muteBtn.textContent = SoundFX.muted ? '🔇' : '🔊';
    if (dom.menuAudioBtn) dom.menuAudioBtn.innerHTML = SoundFX.muted ? '<span>🔇</span> SOUND OFF' : '<span>🔊</span> SOUND ON';
  });
}
if (dom.seasonBtn) {
  dom.seasonBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    applySeason(state.seasonIdx + 1);
    SoundFX.playShockwave();
  });
}
if (dom.pauseBtn) {
  dom.pauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.status === 'playing') {
      state.status = 'paused';
      if (dom.pauseModal) dom.pauseModal.classList.remove('hidden');
    }
  });
}
if (dom.resumeBtn) {
  dom.resumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
    if (state.status === 'paused') {
      state.status = 'playing';
      lastTime = performance.now();
    }
  });
}
if (dom.restartFromPauseBtn) {
  dom.restartFromPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
    startNewGame();
  });
}

if (dom.canvas) {
  dom.canvas.addEventListener('pointerdown', (e) => {
    SoundFX.init();
    if (state.status === 'start') {
      startNewGame();
      return;
    }
    if (state.status !== 'playing') return;
    state.isCharging = true;
    state.chargePower = 0;
  });

  dom.canvas.addEventListener('pointerup', (e) => {
    if (state.status !== 'playing') return;
    const clickedEntity = findBestEntityAtPointer(e.clientX, e.clientY);
    if (clickedEntity) {
      triggerGrappleOrSnatch(clickedEntity, true);
    } else {
      const forwardPlat = getForwardPlatform(1);
      if (forwardPlat) triggerSkillLeap(forwardPlat, false);
    }
    state.isCharging = false;
    state.chargePower = 0;
  });
}

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (state.status === 'start' || state.status === 'gameover') {
      startNewGame();
    } else if (state.status === 'playing') {
      const target = getForwardPlatform(1);
      if (target) triggerSkillLeap(target, false);
    }
  } else if (e.code === 'Enter') {
    e.preventDefault();
    if (state.status === 'playing') {
      triggerManualTongueSnatch();
    }
  } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
    if (state.status === 'playing' && !state.isLeaping && state.currentPlatform) {
      if (state.currentPlatform.type === 'log') {
        state.logSlideVel -= 1.65;
        state.logSlideOffset -= 0.28;
      } else {
        state.frogX = Math.max(state.currentPlatform.x - 0.7, state.frogX - 0.35);
      }
    }
  } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
    if (state.status === 'playing' && !state.isLeaping && state.currentPlatform) {
      if (state.currentPlatform.type === 'log') {
        state.logSlideVel += 1.65;
        state.logSlideOffset += 0.28;
      } else {
        state.frogX = Math.min(state.currentPlatform.x + 0.7, state.frogX + 0.35);
      }
    }
  } else if (e.code === 'KeyB') {
    if (state.status === 'playing') {
      applySeason(state.seasonIdx + 1);
      SoundFX.playShockwave();
    }
  } else if (e.code === 'KeyM') {
    SoundFX.muted = !SoundFX.muted;
    if (dom.muteBtn) dom.muteBtn.textContent = SoundFX.muted ? '🔇' : '🔊';
  } else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (state.status === 'playing') {
      state.status = 'paused';
      if (dom.pauseModal) dom.pauseModal.classList.remove('hidden');
    } else if (state.status === 'paused') {
      state.status = 'playing';
      if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
      lastTime = performance.now();
    }
  }
});

window.addEventListener('resize', () => {
  W = window.innerWidth;
  H = window.innerHeight;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H, false);
});

// Initial Launch
resetRiverWorld();
applySeason(0);
updateHUD();
animId = requestAnimationFrame(animate);
