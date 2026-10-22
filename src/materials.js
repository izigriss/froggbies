import {
  createTerrainTexture,
  createWaterNormalBumpTexture,
  createLilyPadTexture,
  createBarkTexture,
  createGraniteRockTexture,
  createMushroomCapTexture,
  createAmphibianSkinTexture
} from './textures.js';

const THREE = window.THREE;

export const TEX_TERRAIN = createTerrainTexture();
export const TEX_WATER_BUMP = createWaterNormalBumpTexture();
export const TEX_LILYPAD = createLilyPadTexture();
export const TEX_BARK = createBarkTexture();
export const TEX_ROCK = createGraniteRockTexture();
export const TEX_MUSHROOM = createMushroomCapTexture();
export const TEX_FROG_SKIN = createAmphibianSkinTexture();

export const SHARED_MAT = {
  padLeaf: new THREE.MeshStandardMaterial({ map: TEX_LILYPAD, bumpMap: TEX_LILYPAD, bumpScale: 0.045, roughness: 0.28, metalness: 0.05 }),
  padRim: new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.42 }),
  lotusPetal: new THREE.MeshStandardMaterial({ color: 0xfda4af, emissive: 0x9f1239, emissiveIntensity: 0.16, roughness: 0.24 }),
  lotusInnerPetal: new THREE.MeshStandardMaterial({ color: 0xffe4e6, emissive: 0xf43f5e, emissiveIntensity: 0.1, roughness: 0.2 }),
  lotusBud: new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.2, roughness: 0.25 }),
  padWakeRing: new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.28, side: THREE.DoubleSide }),
  logBark: new THREE.MeshStandardMaterial({ map: TEX_BARK, bumpMap: TEX_BARK, bumpScale: 0.075, roughness: 0.82, metalness: 0.02 }),
  logHeartwood: new THREE.MeshStandardMaterial({ color: 0xd6b588, bumpMap: TEX_BARK, bumpScale: 0.02, roughness: 0.62 }),
  logMoss: new THREE.MeshStandardMaterial({ color: 0x3f6212, bumpMap: TEX_TERRAIN, bumpScale: 0.05, roughness: 0.88 }),
  stoneRock: new THREE.MeshStandardMaterial({ map: TEX_ROCK, bumpMap: TEX_ROCK, bumpScale: 0.09, roughness: 0.68, metalness: 0.08 }),
  stoneMoss: new THREE.MeshStandardMaterial({ color: 0x365314, bumpMap: TEX_TERRAIN, bumpScale: 0.05, roughness: 0.86 }),
  mushStem: new THREE.MeshStandardMaterial({ color: 0xfef3c7, bumpMap: TEX_BARK, bumpScale: 0.015, roughness: 0.52 }),
  mushGills: new THREE.MeshStandardMaterial({ color: 0xfde68a, bumpMap: TEX_BARK, bumpScale: 0.04, roughness: 0.7 }),
  mushCap: new THREE.MeshStandardMaterial({ map: TEX_MUSHROOM, bumpMap: TEX_MUSHROOM, bumpScale: 0.03, roughness: 0.18, metalness: 0.05 }),
  mushDot: new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.35 }),
  flyGold: new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.35, roughness: 0.12, metalness: 0.85 }),
  flyEmerald: new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x047857, emissiveIntensity: 0.3, roughness: 0.14, metalness: 0.8 }),
  flyEyeGold: new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.5, roughness: 0.08 }),
  flyEyeCyan: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45, roughness: 0.08 }),
  flyHead: new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.15, metalness: 0.5 }),
  flyWing: new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.52, roughness: 0.05, metalness: 0.25, side: THREE.DoubleSide }),
  waspYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xa16207, emissiveIntensity: 0.18, roughness: 0.22, metalness: 0.3 }),
  waspBlack: new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.18, metalness: 0.35 }),
  waspRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x7f1d1d, emissiveIntensity: 0.35, roughness: 0.2 }),
  waspWing: new THREE.MeshBasicMaterial({ color: 0xfecdd3, transparent: true, opacity: 0.52, side: THREE.DoubleSide }),
  toriiVermilion: new THREE.MeshStandardMaterial({ color: 0xc81e1e, roughness: 0.34, metalness: 0.08 }),
  toriiDarkBase: new THREE.MeshStandardMaterial({ map: TEX_ROCK, bumpMap: TEX_ROCK, bumpScale: 0.06, roughness: 0.82 }),
  toriiGoldRing: new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.38, side: THREE.DoubleSide }),
  vortexRing: new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.62, side: THREE.DoubleSide }),
  vortexFoam: new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.78, side: THREE.DoubleSide })
};

export const SHARED_GEO = {
  padDisc: (() => {
    const g = new THREE.CylinderGeometry(1.44, 1.35, 0.11, 32, 1, false, 0.24, Math.PI * 2 - 0.30);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const r = Math.hypot(vx, vz);
      const a = Math.atan2(vz, vx);
      if (vy > 0 && r > 0.9) {
        pos.setY(i, vy + Math.pow((r - 0.9) / 0.54, 1.5) * 0.09 + Math.sin(a * 7) * 0.015);
      }
    }
    g.computeVertexNormals();
    return g;
  })(),
  lotusPetal: (() => {
    const g = new THREE.SphereGeometry(0.13, 10, 10);
    g.scale(0.62, 1.45, 0.28);
    return g;
  })(),
  lotusBud: new THREE.SphereGeometry(0.11, 10, 10),
  padWakeRing: (() => {
    const g = new THREE.RingGeometry(1.44, 1.64, 32);
    g.rotateX(-Math.PI / 2);
    return g;
  })(),
  logTrunk: (() => {
    const g = new THREE.CylinderGeometry(0.49, 0.53, 3.25, 20, 10);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const a = Math.atan2(vz, vx);
      const gnarl = 1 + Math.sin(vy * 2.2 + a * 3) * 0.055 + Math.cos(a * 6) * 0.025;
      pos.setX(i, vx * gnarl + Math.sin(vy * 1.3) * 0.045);
      pos.setZ(i, vz * gnarl);
    }
    g.computeVertexNormals();
    return g;
  })(),
  logCap: new THREE.CylinderGeometry(0.45, 0.47, 0.06, 18),
  logMossPatch: new THREE.SphereGeometry(0.38, 12, 10),
  stoneBase: (() => {
    const g = new THREE.DodecahedronGeometry(1.38, 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const n = 1 + Math.sin(vx * 3.1 + vz * 2.7) * 0.09 + Math.cos(vy * 4.2) * 0.06;
      pos.setXYZ(i, vx * n, vy * (vy > 0.2 ? 0.55 : 0.85), vz * n);
    }
    g.computeVertexNormals();
    return g;
  })(),
  stoneMossCap: new THREE.CylinderGeometry(1.06, 1.18, 0.16, 16),
  mushStem: (() => {
    const g = new THREE.CylinderGeometry(0.22, 0.36, 0.56, 16, 6);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vy = pos.getY(i);
      const swell = 1 + Math.sin((vy + 0.28) * Math.PI) * 0.16;
      pos.setX(i, pos.getX(i) * swell);
      pos.setZ(i, pos.getZ(i) * swell);
    }
    g.computeVertexNormals();
    return g;
  })(),
  mushCap: (() => {
    const g = new THREE.SphereGeometry(0.84, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vy = pos.getY(i);
      if (vy < 0.18) {
        const flare = 1.07;
        pos.setX(i, pos.getX(i) * flare);
        pos.setZ(i, pos.getZ(i) * flare);
      }
    }
    g.computeVertexNormals();
    return g;
  })(),
  mushGills: new THREE.CylinderGeometry(0.24, 0.78, 0.1, 20),
  mushDot: new THREE.SphereGeometry(0.115, 10, 10),
  flyThorax: new THREE.SphereGeometry(0.19, 14, 12),
  flySeg: new THREE.CylinderGeometry(0.065, 0.052, 0.16, 10),
  flyHead: new THREE.SphereGeometry(0.14, 12, 10),
  flyEye: new THREE.SphereGeometry(0.095, 12, 10),
  flyWing: (() => {
    const g = new THREE.SphereGeometry(0.46, 12, 8);
    g.scale(0.32, 0.025, 1.0);
    g.translate(0, 0, 0.42);
    return g;
  })(),
  waspThorax: new THREE.SphereGeometry(0.21, 14, 12),
  waspAbdomen: (() => {
    const g = new THREE.SphereGeometry(0.30, 16, 14);
    g.scale(0.82, 0.80, 1.48);
    return g;
  })(),
  waspStripe: new THREE.TorusGeometry(0.23, 0.042, 8, 16),
  waspStinger: new THREE.ConeGeometry(0.085, 0.34, 10),
  waspWing: (() => {
    const g = new THREE.SphereGeometry(0.40, 10, 8);
    g.scale(0.34, 0.025, 1.0);
    g.translate(0, 0, 0.36);
    return g;
  })(),
  toriiBase: new THREE.CylinderGeometry(0.4, 0.48, 0.75, 12),
  toriiPillar: new THREE.CylinderGeometry(0.26, 0.32, 5.2, 14),
  toriiTopBeam: new THREE.BoxGeometry(10.2, 0.44, 0.58),
  toriiLowerBeam: new THREE.BoxGeometry(8.8, 0.3, 0.4),
  toriiPortalRing: new THREE.RingGeometry(2.1, 2.45, 32),
  vortexFunnel: new THREE.ConeGeometry(1.38, 0.65, 24, 3, true),
  shockwaveRing: (() => {
    const g = new THREE.RingGeometry(0.45, 0.82, 36);
    g.rotateX(-Math.PI / 2);
    return g;
  })(),
  waterRippleRing: (() => {
    const g = new THREE.RingGeometry(0.25, 0.34, 28);
    g.rotateX(-Math.PI / 2);
    return g;
  })()
};

export const terrainMat = new THREE.MeshStandardMaterial({ map: TEX_TERRAIN, bumpMap: TEX_ROCK, bumpScale: 0.15, roughness: 0.86 });
export const pineFoliageMat = new THREE.MeshStandardMaterial({ color: 0x1e4620, bumpMap: TEX_TERRAIN, bumpScale: 0.05, roughness: 0.72 });
export const willowFoliageMat = new THREE.MeshStandardMaterial({ color: 0x3b7a3e, bumpMap: TEX_TERRAIN, bumpScale: 0.04, roughness: 0.65 });
export const fernMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.55, side: THREE.DoubleSide });
export const reedMat = new THREE.MeshStandardMaterial({ color: 0x4d7c2b, roughness: 0.6 });
export const cattailMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
export const waterfallMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
export const mistMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.38 });
export const sunbeamMat = new THREE.MeshBasicMaterial({ color: 0xfef9c3, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false });

export const frogBodyMat = new THREE.MeshStandardMaterial({
  map: TEX_FROG_SKIN,
  bumpMap: TEX_FROG_SKIN,
  bumpScale: 0.018,
  color: 0x4ade80,
  roughness: 0.16,
  metalness: 0.06
});

export const frogBellyMat = new THREE.MeshStandardMaterial({
  color: 0xfef9c3,
  bumpMap: TEX_FROG_SKIN,
  bumpScale: 0.008,
  roughness: 0.34,
  metalness: 0.02
});

export const frogFlankBlueMat = new THREE.MeshStandardMaterial({
  color: 0x0ea5e9,
  roughness: 0.22,
  metalness: 0.08
});

export const frogFlankGoldMat = new THREE.MeshStandardMaterial({
  color: 0xfacc15,
  roughness: 0.22
});

export const frogToeOrangeMat = new THREE.MeshStandardMaterial({
  color: 0xf97316,
  emissive: 0x7c2d12,
  emissiveIntensity: 0.15,
  roughness: 0.2,
  metalness: 0.05
});

export const frogTympanumMat = new THREE.MeshStandardMaterial({
  color: 0x14532d,
  roughness: 0.28,
  metalness: 0.12
});

export const eyeCrimsonMat = new THREE.MeshStandardMaterial({
  color: 0xdc2626,
  emissive: 0x7f1d1d,
  emissiveIntensity: 0.22,
  roughness: 0.05,
  metalness: 0.12
});

export const pupilMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.02 });
export const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

export const tongueMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.18 });

export const splashDropGeo = new THREE.SphereGeometry(0.11, 8, 8);
export const splashDropMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.9 });
export const bubbleRingMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.85 });
