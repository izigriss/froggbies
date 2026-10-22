export function getSavedHighScore() {
  try {
    return parseInt(localStorage.getItem('froggbies_high_score') || '2400', 10) || 2400;
  } catch (e) {
    return 2400;
  }
}

export function saveHighScore(val) {
  try {
    localStorage.setItem('froggbies_high_score', String(val));
  } catch (e) {}
}

export const RIVER_HALF_WIDTH = 5.2;
export const ENV_CHUNK_LEN = 120;

export const SEASONS = [
  {
    id: 'sunny',
    icon: '☀️',
    name: 'SKY AND ABYSS',
    skyHex: 0x7dd3fc,
    fogHex: 0xa5f3fc,
    fogDensity: 0.0085,
    waterHex: 0x0d5c75,
    waterEmissive: 0x042f40,
    sunHex: 0xfffbeb,
    sunIntensity: 1.55,
    hemiSkyHex: 0xbae6fd,
    hemiGroundHex: 0x1e3a29,
    frogColor: 0x2e8b57,
    particleHex: 0xfef08a
  },
  {
    id: 'monsoon',
    icon: '🌧️',
    name: 'MONSOON STORM',
    skyHex: 0x1e293b,
    fogHex: 0x1e293b,
    fogDensity: 0.013,
    waterHex: 0x0f293a,
    waterEmissive: 0x05131d,
    sunHex: 0x94a3b8,
    sunIntensity: 0.85,
    hemiSkyHex: 0x475569,
    hemiGroundHex: 0x0f172a,
    frogColor: 0x3b9c64,
    particleHex: 0xbae6fd
  },
  {
    id: 'glacier',
    icon: '❄️',
    name: 'ALPINE FROST',
    skyHex: 0xcbd5e1,
    fogHex: 0xe2e8f0,
    fogDensity: 0.010,
    waterHex: 0x0c4a6e,
    waterEmissive: 0x082f49,
    sunHex: 0xf8fafc,
    sunIntensity: 1.35,
    hemiSkyHex: 0xe2e8f0,
    hemiGroundHex: 0x334155,
    frogColor: 0x2b7a78,
    particleHex: 0xffffff
  },
  {
    id: 'night',
    icon: '✨',
    name: 'FIREFLY NIGHT',
    skyHex: 0x060b16,
    fogHex: 0x060b16,
    fogDensity: 0.0115,
    waterHex: 0x061a2e,
    waterEmissive: 0x041224,
    sunHex: 0x60a5fa,
    sunIntensity: 0.65,
    hemiSkyHex: 0x1e3a8a,
    hemiGroundHex: 0x050811,
    frogColor: 0x34d399,
    particleHex: 0xfde047
  }
];
