import {
  RIVER_HALF_WIDTH,
  ENV_CHUNK_LEN
} from '../constants.js';
import {
  SHARED_MAT,
  SHARED_GEO,
  terrainMat,
  pineFoliageMat,
  willowFoliageMat,
  fernMat,
  reedMat,
  cattailMat,
  waterfallMat,
  mistMat
} from '../materials.js';

const THREE = window.THREE;

export const entitiesGroup = new THREE.Group();
export const environmentGroup = new THREE.Group();
export const animatedSwayProps = [];
export const animatedWaterfalls = [];

export function createOrganicBankTerrain(sideSign, chunkZOffset) {
  const width = 26;
  const length = ENV_CHUNK_LEN;
  const geo = new THREE.PlaneGeometry(width, length, 24, 56);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const uvs = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const lx = pos.getX(i);
    const lz = pos.getZ(i);
    const worldZ = lz + chunkZOffset;
    const t = sideSign > 0 ? (lx + width * 0.5) / width : (width * 0.5 - lx) / width;
    const shoreMeander = Math.sin(worldZ * 0.055 + sideSign * 1.4) * 1.15 + Math.cos(worldZ * 0.12 - sideSign * 0.8) * 0.55;
    const worldX = sideSign * (RIVER_HALF_WIDTH - 0.6 + t * width) + shoreMeander * (1 - t * 0.5);
    const ridgeNoise =
      Math.sin(worldZ * 0.045 + t * 5.0 + sideSign) * 1.8 +
      Math.cos(worldZ * 0.11 - t * 8.0) * 0.95 +
      Math.sin(worldZ * 0.25 + t * 14.0) * 0.42;
    let y = -0.35;
    if (t > 0.04) {
      y = -0.15 + Math.pow(t, 1.32) * 14.2 + ridgeNoise * Math.min(1, t * 2.2);
    }
    pos.setXYZ(i, worldX, y, lz);
    uvs.setXY(i, t, (lz + length * 0.5) / 20);
  }
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, terrainMat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

export function createShoreReedCluster(x, z, sideSign) {
  const group = new THREE.Group();
  group.position.set(x, -0.05, z);
  const count = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const h = 1.15 + Math.random() * 0.9;
    const stalkPivot = new THREE.Group();
    stalkPivot.position.set((Math.random() - 0.5) * 0.75, 0, (Math.random() - 0.5) * 0.75);
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.045, h, 5), reedMat);
    blade.position.y = h * 0.5;
    stalkPivot.add(blade);
    if (i % 2 === 0) {
      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.28, 6), cattailMat);
      head.position.y = h * 0.78;
      stalkPivot.add(head);
    }
    const baseTiltZ = -sideSign * (0.08 + Math.random() * 0.12);
    stalkPivot.rotation.z = baseTiltZ;
    group.add(stalkPivot);
    animatedSwayProps.push({ obj: stalkPivot, baseRotZ: baseTiltZ, baseRotX: 0, phase: x + z + i, amp: 0.1, speed: 2.2 });
  }
  return group;
}

export function createShoreFernCluster(x, y, z, sideSign) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  for (let f = 0; f < 7; f++) {
    const angle = (f / 7) * Math.PI * 2;
    const frondPivot = new THREE.Group();
    frondPivot.rotation.y = angle;
    const frond = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.05, 4), fernMat);
    frond.scale.set(1, 1, 0.18);
    frond.position.set(0, 0.35, 0.38);
    frond.rotation.x = 0.88;
    frondPivot.add(frond);
    group.add(frondPivot);
  }
  animatedSwayProps.push({ obj: group, baseRotZ: -sideSign * 0.06, baseRotX: 0, phase: x * 0.5 + z, amp: 0.08, speed: 1.9 });
  return group;
}

export function createNaturalRiverTree(x, y, z, sideSign, isWillow) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  const scale = 0.88 + Math.random() * 0.55;

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.38 * scale, 2.5 * scale, 8), SHARED_MAT.logBark);
  trunk.position.y = 1.15 * scale;
  trunk.rotation.z = -sideSign * 0.11;
  trunk.castShadow = true;
  group.add(trunk);

  const crownPivot = new THREE.Group();
  crownPivot.position.set(-sideSign * 0.24 * scale, 2.25 * scale, 0);
  group.add(crownPivot);

  if (isWillow) {
    const mainCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1 * scale, 1), willowFoliageMat);
    mainCrown.scale.set(1.2, 0.85, 1.2);
    mainCrown.castShadow = true;
    crownPivot.add(mainCrown);

    for (let b = 0; b < 6; b++) {
      const a = (b / 6) * Math.PI * 2;
      const bough = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75 * scale, 1), willowFoliageMat);
      bough.position.set(Math.cos(a) * 0.72 * scale, -0.15 * scale, Math.sin(a) * 0.72 * scale);
      bough.scale.set(0.72, 1.65, 0.72);
      bough.castShadow = true;
      crownPivot.add(bough);
    }
  } else {
    for (let t = 0; t < 4; t++) {
      const tierRadius = (1.72 - t * 0.33) * scale;
      const tierHeight = (1.95 - t * 0.22) * scale;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(tierRadius, tierHeight, 9), pineFoliageMat);
      cone.position.y = t * 0.95 * scale;
      cone.rotation.y = t * 0.65;
      cone.castShadow = true;
      crownPivot.add(cone);
    }
  }
  animatedSwayProps.push({ obj: crownPivot, baseRotZ: -sideSign * 0.05, baseRotX: 0, phase: z + x, amp: 0.06, speed: 1.6 });
  return group;
}

export function createCliffWaterfall(sideSign, z) {
  const group = new THREE.Group();
  const xEdge = sideSign * (RIVER_HALF_WIDTH + 2.6);
  group.position.set(xEdge, 0, z);

  for (let r = 0; r < 5; r++) {
    const rock = new THREE.Mesh(SHARED_GEO.stoneBase, SHARED_MAT.stoneRock);
    rock.scale.set(0.95, 1.65, 0.95);
    rock.position.set(sideSign * (0.5 + (r % 2) * 0.7), 0.8 + r * 0.95, (r - 2) * 0.85);
    rock.rotation.set(r * 0.4, r * 1.1, 0);
    rock.castShadow = true;
    group.add(rock);
  }

  const streamGeo = new THREE.PlaneGeometry(1.65, 6.5, 4, 12);
  const streamMesh = new THREE.Mesh(streamGeo, waterfallMat);
  streamMesh.position.set(-sideSign * 0.3, 3.0, 0);
  streamMesh.rotation.y = -sideSign * Math.PI * 0.5;
  streamMesh.rotation.x = -0.22;
  group.add(streamMesh);

  const mists = [];
  for (let m = 0; m < 5; m++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), mistMat);
    puff.position.set(-sideSign * (0.9 + Math.random() * 0.6), 0.25, (m - 2) * 0.45);
    group.add(puff);
    mists.push({ mesh: puff, phase: m * 1.3 });
  }
  animatedWaterfalls.push({ streamGeo, mists });
  return group;
}

export function buildValleyChunk(chunkIndex) {
  const chunkGroup = new THREE.Group();
  const zCenter = -chunkIndex * ENV_CHUNK_LEN;
  chunkGroup.position.z = zCenter;
  chunkGroup.add(createOrganicBankTerrain(-1, zCenter));
  chunkGroup.add(createOrganicBankTerrain(1, zCenter));

  for (let lz = -ENV_CHUNK_LEN * 0.5 + 4; lz < ENV_CHUNK_LEN * 0.5 - 4; lz += 6.2) {
    [-1, 1].forEach((sideSign) => {
      const worldZ = lz + zCenter;
      const shoreMeander = Math.sin(worldZ * 0.055 + sideSign * 1.4) * 1.15;
      const shoreX = sideSign * (RIVER_HALF_WIDTH + 0.2) + shoreMeander * 0.85;

      if (Math.abs(Math.sin(worldZ * 1.7)) > 0.32) {
        chunkGroup.add(createShoreReedCluster(shoreX - sideSign * 0.35, lz, sideSign));
      }

      if (Math.abs(Math.cos(worldZ * 0.85 + sideSign)) > 0.42) {
        const boulder = new THREE.Mesh(SHARED_GEO.stoneBase, SHARED_MAT.stoneRock);
        const bs = 0.55 + Math.abs(Math.sin(worldZ * 0.9)) * 0.68;
        boulder.scale.set(bs * 1.15, bs * 0.78, bs);
        boulder.position.set(shoreX + sideSign * 0.65, 0.12, lz + 1.4);
        boulder.rotation.y = worldZ * 0.6;
        boulder.castShadow = true;
        boulder.receiveShadow = true;
        chunkGroup.add(boulder);

        const fern = createShoreFernCluster(shoreX + sideSign * 1.25, 0.28, lz + 2.1, sideSign);
        chunkGroup.add(fern);
      }

      const treeX = shoreX + sideSign * (2.6 + Math.abs(Math.sin(worldZ * 0.5)) * 2.1);
      const isWillow = Math.abs(Math.sin(worldZ * 0.35 + sideSign)) > 0.56;
      chunkGroup.add(createNaturalRiverTree(treeX, 0.65, lz, sideSign, isWillow));

      const ridgeTreeX = shoreX + sideSign * (7.2 + Math.abs(Math.cos(worldZ * 0.42)) * 4.2);
      chunkGroup.add(createNaturalRiverTree(ridgeTreeX, 3.2, lz + 2.8, sideSign, false));
    });
  }
  chunkGroup.add(createCliffWaterfall(-1, -24));
  chunkGroup.add(createCliffWaterfall(1, 28));
  environmentGroup.add(chunkGroup);
  return chunkGroup;
}

export function initPlatformPhysics(platObj) {
  platObj.springY = 0;
  platObj.springVelY = 0;
  platObj.tiltX = 0;
  platObj.tiltZ = 0;
  platObj.velTiltX = 0;
  platObj.velTiltZ = 0;
  platObj.rotY = Math.random() * Math.PI * 2;
  platObj.rotSpeed = (Math.random() - 0.5) * 0.35;
  platObj.freq1 = 0.75 + Math.random() * 0.65;
  platObj.freq2 = 1.45 + Math.random() * 0.85;
  platObj.phase1 = Math.random() * Math.PI * 2;
  platObj.phase2 = Math.random() * 0.85;
  platObj.ampX = 0.35 + Math.random() * 0.55;
  platObj.sinkOffset = 0;
  return platObj;
}

export function createLilyPad3D(x, z) {
  const group = new THREE.Group();
  const pad = new THREE.Mesh(SHARED_GEO.padDisc, SHARED_MAT.padLeaf);
  pad.castShadow = true;
  pad.receiveShadow = true;
  group.add(pad);

  if (Math.random() < 0.75) {
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(0.66, 0.09, -0.38);
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const outerPetal = new THREE.Mesh(SHARED_GEO.lotusPetal, SHARED_MAT.lotusPetal);
      outerPetal.position.set(Math.cos(a) * 0.16, 0.08, Math.sin(a) * 0.16);
      outerPetal.rotation.y = -a + Math.PI * 0.5;
      outerPetal.rotation.x = 0.62;
      lotusGroup.add(outerPetal);
    }
    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI * 2 + 0.3;
      const innerPetal = new THREE.Mesh(SHARED_GEO.lotusPetal, SHARED_MAT.lotusInnerPetal);
      innerPetal.scale.setScalar(0.78);
      innerPetal.position.set(Math.cos(a) * 0.10, 0.12, Math.sin(a) * 0.10);
      innerPetal.rotation.y = -a + Math.PI * 0.5;
      innerPetal.rotation.x = 0.34;
      lotusGroup.add(innerPetal);
    }
    const bud = new THREE.Mesh(SHARED_GEO.lotusBud, SHARED_MAT.lotusBud);
    bud.position.y = 0.12;
    lotusGroup.add(bud);
    group.add(lotusGroup);
  }

  const wake = new THREE.Mesh(SHARED_GEO.padWakeRing, SHARED_MAT.padWakeRing);
  wake.position.y = -0.03;
  group.add(wake);
  group.position.set(x, 0.06, z);
  entitiesGroup.add(group);
  return initPlatformPhysics({ type: 'pad', x, baseX: x, z, baseZ: z, baseY: 0.06, group, radius: 1.48 });
}

export function createCedarLog3D(x, z) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(SHARED_GEO.logTrunk, SHARED_MAT.logBark);
  trunk.rotation.z = Math.PI / 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  [-1.62, 1.62].forEach((endX, idx) => {
    const cap = new THREE.Mesh(SHARED_GEO.logCap, SHARED_MAT.logHeartwood);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = endX;
    group.add(cap);

    const innerRing = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.065, 14), SHARED_MAT.logBark);
    innerRing.rotation.z = Math.PI / 2;
    innerRing.position.x = endX + (idx === 0 ? -0.005 : 0.005);
    group.add(innerRing);
  });

  const branchKnot = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.42, 8), SHARED_MAT.logBark);
  branchKnot.position.set(0.75, 0.42, 0.22);
  branchKnot.rotation.z = -0.35;
  branchKnot.rotation.x = 0.42;
  group.add(branchKnot);

  [-0.45, 0.35].forEach((mx, i) => {
    const moss = new THREE.Mesh(SHARED_GEO.logMossPatch, SHARED_MAT.logMoss);
    moss.scale.set(1.8 - i * 0.4, 0.32, 0.85);
    moss.position.set(mx, 0.43, (i - 0.5) * 0.14);
    group.add(moss);
  });

  for (let f = 0; f < 2; f++) {
    const fungus = new THREE.Mesh(SHARED_GEO.mushDot, SHARED_MAT.mushStem);
    fungus.scale.set(1.5, 0.45, 1.2);
    fungus.position.set(-0.8 + f * 0.32, 0.18 + f * 0.06, 0.48);
    group.add(fungus);
  }

  group.position.set(x, 0.14, z);
  entitiesGroup.add(group);
  return initPlatformPhysics({ type: 'log', x, baseX: x, z, baseZ: z, baseY: 0.14, group, radius: 1.68 });
}

export function createMossyRiverStone3D(x, z) {
  const group = new THREE.Group();
  const stone = new THREE.Mesh(SHARED_GEO.stoneBase, SHARED_MAT.stoneRock);
  stone.scale.set(1.18, 0.48, 1.08);
  stone.castShadow = true;
  stone.receiveShadow = true;
  group.add(stone);

  [-0.95, 0.92].forEach((px, idx) => {
    const pebble = new THREE.Mesh(SHARED_GEO.stoneBase, SHARED_MAT.stoneRock);
    pebble.scale.set(0.36, 0.25, 0.32);
    pebble.position.set(px, -0.04, idx === 0 ? 0.55 : -0.48);
    pebble.rotation.y = idx * 1.7;
    group.add(pebble);
  });

  const mossCap = new THREE.Mesh(SHARED_GEO.stoneMossCap, SHARED_MAT.stoneMoss);
  mossCap.position.y = 0.28;
  mossCap.receiveShadow = true;
  group.add(mossCap);

  const wake = new THREE.Mesh(SHARED_GEO.padWakeRing, SHARED_MAT.padWakeRing);
  wake.position.y = -0.02;
  group.add(wake);

  group.position.set(x, 0.08, z);
  entitiesGroup.add(group);
  const st = initPlatformPhysics({ type: 'stone', x, baseX: x, z, baseZ: z, baseY: 0.08, group, radius: 1.42 });
  st.ampX = 0.04;
  return st;
}

export function createToadstoolMushroom3D(x, z) {
  const group = new THREE.Group();
  const basePad = new THREE.Mesh(SHARED_GEO.padDisc, SHARED_MAT.padLeaf);
  basePad.scale.set(0.92, 1, 0.92);
  basePad.castShadow = true;
  basePad.receiveShadow = true;
  group.add(basePad);

  const stem = new THREE.Mesh(SHARED_GEO.mushStem, SHARED_MAT.mushStem);
  stem.position.y = 0.28;
  stem.castShadow = true;
  group.add(stem);

  const capGroup = new THREE.Group();
  capGroup.position.y = 0.54;

  const gills = new THREE.Mesh(SHARED_GEO.mushGills, SHARED_MAT.mushGills);
  gills.position.y = 0.02;
  capGroup.add(gills);

  const cap = new THREE.Mesh(SHARED_GEO.mushCap, SHARED_MAT.mushCap);
  cap.castShadow = true;
  capGroup.add(cap);

  for (let d = 0; d < 9; d++) {
    const ringR = d < 6 ? 0.52 : 0.25;
    const a = (d % 6) * (Math.PI * 2 / 6) + (d >= 6 ? 0.5 : 0);
    const dot = new THREE.Mesh(SHARED_GEO.mushDot, SHARED_MAT.mushDot);
    dot.scale.set(1.1, 0.55, 1.1);
    dot.position.set(Math.cos(a) * ringR, d < 6 ? 0.42 : 0.68, Math.sin(a) * ringR);
    capGroup.add(dot);
  }
  group.add(capGroup);

  const miniStem = new THREE.Mesh(SHARED_GEO.mushStem, SHARED_MAT.mushStem);
  miniStem.scale.setScalar(0.38);
  miniStem.position.set(0.68, 0.14, 0.25);
  miniStem.rotation.z = -0.28;
  group.add(miniStem);

  const miniCap = new THREE.Mesh(SHARED_GEO.mushCap, SHARED_MAT.mushCap);
  miniCap.scale.setScalar(0.36);
  miniCap.position.set(0.74, 0.25, 0.25);
  miniCap.rotation.z = -0.28;
  group.add(miniCap);

  group.position.set(x, 0.07, z);
  entitiesGroup.add(group);
  const mush = initPlatformPhysics({ type: 'mushroom', x, baseX: x, z, baseZ: z, baseY: 0.07, group, radius: 1.38 });
  mush.ampX = 0.55 + Math.random() * 0.45;
  return mush;
}

export function createWhirlpoolPad3D(x, z) {
  const group = new THREE.Group();
  const pad = new THREE.Mesh(SHARED_GEO.padDisc, SHARED_MAT.padLeaf);
  pad.scale.set(0.92, 1, 0.92);
  group.add(pad);

  const funnel = new THREE.Mesh(SHARED_GEO.vortexFunnel, SHARED_MAT.vortexRing);
  funnel.position.y = -0.24;
  group.add(funnel);

  const outerSwirl = new THREE.Mesh(SHARED_GEO.padWakeRing, SHARED_MAT.vortexFoam);
  outerSwirl.scale.set(1.26, 1, 1.26);
  outerSwirl.position.y = 0.02;
  group.add(outerSwirl);

  const innerSwirl = new THREE.Mesh(SHARED_GEO.shockwaveRing, SHARED_MAT.vortexRing);
  innerSwirl.scale.set(1.06, 1, 1.06);
  innerSwirl.position.y = 0.08;
  group.add(innerSwirl);

  group.position.set(x, 0.05, z);
  entitiesGroup.add(group);
  const vp = initPlatformPhysics({ type: 'vortex', x, baseX: x, z, baseZ: z, baseY: 0.05, group, radius: 1.42 });
  vp.rotSpeed = 5.5;
  vp.vortexTimer = 0;
  return vp;
}

export function createDragonfly3D(x, z) {
  const group = new THREE.Group();
  const isGolden = Math.random() < 0.35;
  const bodyMat = isGolden ? SHARED_MAT.flyGold : SHARED_MAT.flyEmerald;
  const eyeMat = isGolden ? SHARED_MAT.flyEyeGold : SHARED_MAT.flyEyeCyan;

  const thorax = new THREE.Mesh(SHARED_GEO.flyThorax, bodyMat);
  thorax.scale.set(0.92, 0.88, 1.38);
  group.add(thorax);

  for (let s = 0; s < 5; s++) {
    const seg = new THREE.Mesh(SHARED_GEO.flySeg, bodyMat);
    seg.rotation.x = Math.PI * 0.5;
    const sc = 1 - s * 0.1;
    seg.scale.set(sc, 1, sc);
    seg.position.set(0, -s * 0.012, 0.22 + s * 0.145);
    group.add(seg);
  }

  const head = new THREE.Mesh(SHARED_GEO.flyHead, SHARED_MAT.flyHead);
  head.position.set(0, 0.03, -0.22);
  group.add(head);

  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(SHARED_GEO.flyEye, eyeMat);
    eye.position.set(side * 0.095, 0.05, -0.25);
    group.add(eye);
  });

  const leftWing = new THREE.Mesh(SHARED_GEO.flyWing, SHARED_MAT.flyWing);
  leftWing.position.set(-0.10, 0.12, -0.06);
  leftWing.rotation.y = -Math.PI * 0.5 - 0.12;
  group.add(leftWing);

  const rightWing = new THREE.Mesh(SHARED_GEO.flyWing, SHARED_MAT.flyWing);
  rightWing.position.set(0.10, 0.12, -0.06);
  rightWing.rotation.y = Math.PI * 0.5 + 0.12;
  group.add(rightWing);

  const leftHindWing = new THREE.Mesh(SHARED_GEO.flyWing, SHARED_MAT.flyWing);
  leftHindWing.scale.setScalar(0.85);
  leftHindWing.position.set(-0.10, 0.10, 0.08);
  leftHindWing.rotation.y = -Math.PI * 0.5 + 0.15;
  group.add(leftHindWing);

  const rightHindWing = new THREE.Mesh(SHARED_GEO.flyWing, SHARED_MAT.flyWing);
  rightHindWing.scale.setScalar(0.85);
  rightHindWing.position.set(0.10, 0.10, 0.08);
  rightHindWing.rotation.y = Math.PI * 0.5 - 0.15;
  group.add(rightHindWing);

  const dir = Math.random() < 0.5 ? 1 : -1;
  const startX = (Math.random() - 0.5) * 6.5;
  const startY = 1.15 + Math.random() * 0.65;
  group.position.set(startX, startY, z);
  entitiesGroup.add(group);

  return {
    type: 'fly',
    isGolden,
    points: isGolden ? 300 : 150,
    x: startX,
    y: startY,
    baseY: startY,
    z,
    baseZ: z,
    dir,
    speedX: 2.1 + Math.random() * 1.4,
    pauseX: (Math.random() - 0.5) * 3.4,
    hasPaused: false,
    hoverTimer: 0,
    group,
    leftWing,
    rightWing,
    leftHindWing,
    rightHindWing,
    caught: false,
    snatchedByTongue: false,
    magnetized: false,
    wingPhase: Math.random() * 10,
    flightTime: Math.random() * 20
  };
}

export function createStripedWasp3D(x, z) {
  const group = new THREE.Group();

  const thorax = new THREE.Mesh(SHARED_GEO.waspThorax, SHARED_MAT.waspBlack);
  thorax.scale.set(0.95, 0.92, 1.25);
  group.add(thorax);

  const head = new THREE.Mesh(SHARED_GEO.flyHead, SHARED_MAT.waspYellow);
  head.scale.set(1.15, 1.05, 1.0);
  head.position.set(0, 0.02, -0.25);
  group.add(head);

  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(SHARED_GEO.flyEye, SHARED_MAT.waspRed);
    eye.scale.set(0.85, 1.2, 0.95);
    eye.position.set(side * 0.11, 0.04, -0.28);
    group.add(eye);
  });

  const abdomenGroup = new THREE.Group();
  abdomenGroup.position.set(0, -0.05, 0.42);
  abdomenGroup.rotation.x = -0.22;

  const abdomen = new THREE.Mesh(SHARED_GEO.waspAbdomen, SHARED_MAT.waspYellow);
  abdomenGroup.add(abdomen);

  [-0.14, 0.02, 0.18].forEach((bz, idx) => {
    const stripe = new THREE.Mesh(SHARED_GEO.waspStripe, idx === 1 ? SHARED_MAT.waspRed : SHARED_MAT.waspBlack);
    stripe.scale.set(1 - Math.abs(bz) * 0.65, 1 - Math.abs(bz) * 0.65, 1);
    stripe.position.z = bz;
    abdomenGroup.add(stripe);
  });

  const stinger = new THREE.Mesh(SHARED_GEO.waspStinger, SHARED_MAT.waspBlack);
  stinger.rotation.x = Math.PI * 0.5;
  stinger.position.z = 0.54;
  abdomenGroup.add(stinger);
  group.add(abdomenGroup);

  const leftWing = new THREE.Mesh(SHARED_GEO.waspWing, SHARED_MAT.waspWing);
  leftWing.position.set(-0.12, 0.18, -0.04);
  leftWing.rotation.y = -Math.PI * 0.5 - 0.15;
  group.add(leftWing);

  const rightWing = new THREE.Mesh(SHARED_GEO.waspWing, SHARED_MAT.waspWing);
  rightWing.position.set(0.12, 0.18, -0.04);
  rightWing.rotation.y = Math.PI * 0.5 + 0.15;
  group.add(rightWing);

  const dir = Math.random() < 0.5 ? 1 : -1;
  const startX = (Math.random() - 0.5) * 7.5;
  group.position.set(startX, 1.22, z);
  entitiesGroup.add(group);

  return {
    type: 'wasp',
    x: startX,
    y: 1.22,
    z,
    baseZ: z,
    dir,
    speedX: 2.8 + Math.random() * 1.45,
    group,
    leftWing,
    rightWing,
    phase: Math.random() * Math.PI * 2
  };
}

export function createToriiGate3D(z) {
  const group = new THREE.Group();
  [-4.2, 4.2].forEach((px) => {
    const pillar = new THREE.Mesh(SHARED_GEO.toriiPillar, SHARED_MAT.toriiVermilion);
    pillar.position.set(px, 2.7, 0);
    pillar.castShadow = true;
    group.add(pillar);
  });
  const topBeam = new THREE.Mesh(SHARED_GEO.toriiTopBeam, SHARED_MAT.toriiVermilion);
  topBeam.position.set(0, 5.2, 0);
  group.add(topBeam);
  const portalRing = new THREE.Mesh(SHARED_GEO.toriiPortalRing, SHARED_MAT.toriiGoldRing);
  portalRing.position.set(0, 2.5, 0);
  group.add(portalRing);
  group.position.set(0, 0, z);
  entitiesGroup.add(group);
  return { z, group, portalRing, passed: false };
}
