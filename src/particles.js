import { state } from './state.js';
import {
  SHARED_GEO,
  splashDropGeo,
  splashDropMat,
  bubbleRingMat
} from './materials.js';

const THREE = window.THREE;

let sceneRef = null;
let cameraRef = null;
let popupLayerRef = null;

export function initParticles(scene, camera, popupLayer) {
  sceneRef = scene;
  cameraRef = camera;
  popupLayerRef = popupLayer;
}

export function spawnWaterRipple(x, z, maxScale = 2.6, opacity = 0.55) {
  if (!sceneRef) return;
  const mat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(SHARED_GEO.waterRippleRing, mat);
  mesh.position.set(x, 0.03, z);
  sceneRef.add(mesh);
  state.waterRipples.push({ mesh, mat, scale: 0.6, maxScale, alpha: opacity });
}

export function spawn3DSplashBurst(x, y, z, count = 22, isVortex = false) {
  if (!sceneRef) return;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const speed = 1.6 + Math.random() * 3.4;
    const mesh = new THREE.Mesh(splashDropGeo, i % 3 === 0 ? bubbleRingMat : splashDropMat);
    const scale = 0.6 + Math.random() * 1.1;
    mesh.scale.setScalar(scale);
    mesh.position.set(x + (Math.random() - 0.5) * 0.4, Math.max(0.05, y), z + (Math.random() - 0.5) * 0.4);
    sceneRef.add(mesh);
    state.splashParticles.push({
      mesh,
      vx: Math.cos(angle) * speed * (isVortex ? 0.6 : 1),
      vy: 2.8 + Math.random() * 3.8,
      vz: Math.sin(angle) * speed + (isVortex ? 0 : 1.5),
      life: 0,
      maxLife: 0.65 + Math.random() * 0.45,
      isBubble: i % 3 === 0
    });
  }
}

export function spawnScorePopup(text, worldX, worldY, worldZ, colorHex = '#fde047') {
  if (!cameraRef || !popupLayerRef) return;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const vec = new THREE.Vector3(worldX, worldY, worldZ);
  vec.project(cameraRef);
  const sx = (vec.x * 0.5 + 0.5) * W;
  const sy = (-vec.y * 0.5 + 0.5) * H;
  const el = document.createElement('div');
  el.className = 'score-pop';
  el.textContent = text;
  el.style.color = colorHex;
  el.style.left = `${Math.max(12, Math.min(88, (sx / W) * 100))}%`;
  el.style.top = `${Math.max(15, Math.min(82, (sy / H) * 100))}%`;
  popupLayerRef.appendChild(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 950);
}
