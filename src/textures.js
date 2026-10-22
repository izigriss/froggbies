// Procedural PBR Canvas 2D Textures
export function createTerrainTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0.0, '#5c5346');
  grad.addColorStop(0.18, '#3f4e32');
  grad.addColorStop(0.55, '#263e24');
  grad.addColorStop(1.0, '#1e2923');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 3.5;
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(68, 105, 48, 0.28)' : 'rgba(20, 34, 22, 0.32)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new window.THREE.CanvasTexture(c);
  tex.wrapS = window.THREE.ClampToEdgeWrapping;
  tex.wrapT = window.THREE.RepeatWrapping;
  tex.repeat.set(1, 6);
  return tex;
}

export function createWaterNormalBumpTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const w = 12 + Math.random() * 36;
    const h = 3 + Math.random() * 8;
    const g = ctx.createRadialGradient(x, y, 1, x, y, w * 0.5);
    g.addColorStop(0, 'rgba(255,255,255,0.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new window.THREE.CanvasTexture(c);
  tex.wrapS = window.THREE.RepeatWrapping;
  tex.wrapT = window.THREE.RepeatWrapping;
  tex.repeat.set(3, 18);
  return tex;
}

export function createLilyPadTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const cx = 128, cy = 128;
  const rad = ctx.createRadialGradient(cx, cy, 8, cx, cy, 126);
  rad.addColorStop(0, '#4d9e3f');
  rad.addColorStop(0.65, '#2b7a29');
  rad.addColorStop(0.92, '#1e591f');
  rad.addColorStop(1, '#3f6212');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(163, 230, 53, 0.42)';
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const midX = cx + Math.cos(a + 0.08) * 64;
    const midY = cy + Math.sin(a + 0.08) * 64;
    const endX = cx + Math.cos(a) * 120;
    const endY = cy + Math.sin(a) * 120;
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.stroke();
  }
  return new window.THREE.CanvasTexture(c);
}

export function createAmphibianSkinTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#15803d');
  grad.addColorStop(0.35, '#22c55e');
  grad.addColorStop(0.75, '#4ade80');
  grad.addColorStop(1.0, '#bef264');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Organic dorsal mottling and amphibian skin pores
  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 0.8 + Math.random() * 3.2;
    ctx.fillStyle = Math.random() < 0.45 ? 'rgba(6, 78, 59, 0.16)' : 'rgba(217, 249, 157, 0.15)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Subtle darker organic dorsal leopard spots
  for (let i = 0; i < 28; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 360;
    const rx = 8 + Math.random() * 16;
    const ry = 6 + Math.random() * 12;
    ctx.fillStyle = 'rgba(5, 46, 22, 0.22)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new window.THREE.CanvasTexture(c);
  tex.wrapS = window.THREE.RepeatWrapping;
  tex.wrapT = window.THREE.RepeatWrapping;
  return tex;
}

export function createBarkTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#3e2413';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 550; i++) {
    const x = Math.random() * 512;
    const w = 2 + Math.random() * 9;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(18, 9, 4, 0.6)' : 'rgba(92, 56, 30, 0.42)';
    ctx.fillRect(x, 0, w, 512);
  }
  for (let i = 0; i < 95; i++) {
    ctx.fillStyle = 'rgba(48, 96, 34, 0.35)';
    ctx.beginPath();
    ctx.ellipse(Math.random() * 512, Math.random() * 512, 8 + Math.random() * 24, 4 + Math.random() * 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new window.THREE.CanvasTexture(c);
  tex.wrapS = window.THREE.RepeatWrapping;
  tex.wrapT = window.THREE.RepeatWrapping;
  return tex;
}

export function createGraniteRockTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 6500; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(15, 23, 42, 0.38)' : 'rgba(148, 163, 184, 0.26)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 8, 2 + Math.random() * 6);
  }
  const tex = new window.THREE.CanvasTexture(c);
  tex.wrapS = window.THREE.RepeatWrapping;
  tex.wrapT = window.THREE.RepeatWrapping;
  return tex;
}

export function createMushroomCapTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(256, 256, 12, 256, 256, 256);
  grad.addColorStop(0, '#991b1b');
  grad.addColorStop(0.55, '#dc2626');
  grad.addColorStop(1, '#ef4444');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(127, 29, 29, 0.18)' : 'rgba(254, 226, 226, 0.12)';
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  return new window.THREE.CanvasTexture(c);
}
