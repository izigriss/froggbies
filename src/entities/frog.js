import {
  frogBodyMat,
  frogBellyMat,
  frogFlankBlueMat,
  frogFlankGoldMat,
  frogToeOrangeMat,
  frogTympanumMat,
  eyeCrimsonMat,
  pupilMat,
  catchlightMat,
  tongueMat
} from '../materials.js';

const THREE = window.THREE;

export const frogRoot = new THREE.Group();
export const frogSquashGroup = new THREE.Group();
frogRoot.add(frogSquashGroup);

// Sculpted Organic Amphibian Torso (tapered waist, arched dorsal spine, inclined crouching posture)
const torsoGeo = new THREE.SphereGeometry(0.56, 28, 22);
const tPos = torsoGeo.attributes.position;
for (let i = 0; i < tPos.count; i++) {
  let vx = tPos.getX(i);
  let vy = tPos.getY(i);
  let vz = tPos.getZ(i);
  const zFactor = (vz + 0.56) / 1.12;
  vx *= (1.12 - zFactor * 0.28);
  vy *= (0.78 - zFactor * 0.12);
  vz *= 1.32;
  if (vy > 0) vy += Math.cos(vx * 2.2) * 0.06;
  tPos.setXYZ(i, vx, vy, vz);
}
torsoGeo.computeVertexNormals();

export const frogTorso = new THREE.Mesh(torsoGeo, frogBodyMat);
frogTorso.position.set(0, 0.38, 0.12);
frogTorso.rotation.x = 0.24;
frogTorso.castShadow = true;
frogTorso.receiveShadow = true;
frogSquashGroup.add(frogTorso);

// Soft Cream Underbelly Contour
const underbelly = new THREE.Mesh(new THREE.SphereGeometry(0.49, 20, 16), frogBellyMat);
underbelly.scale.set(0.95, 0.58, 1.22);
underbelly.position.set(0, 0.27, 0.08);
underbelly.rotation.x = 0.24;
frogSquashGroup.add(underbelly);

// Signature Red-Eyed Tree Frog Blue & Gold Rib Stripes along both flanks
[-1, 1].forEach((side) => {
  const flankPatch = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 12), frogFlankBlueMat);
  flankPatch.scale.set(0.32, 0.52, 1.35);
  flankPatch.position.set(side * 0.46, 0.34, 0.12);
  flankPatch.rotation.x = 0.24;
  flankPatch.rotation.z = -side * 0.18;
  frogSquashGroup.add(flankPatch);

  for (let b = 0; b < 3; b++) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.24, 8), frogFlankGoldMat);
    bar.position.set(side * 0.51, 0.35 - b * 0.02, -0.04 + b * 0.16);
    bar.rotation.z = side * 0.25;
    bar.rotation.x = 0.15;
    frogSquashGroup.add(bar);
  }
});

// Articulated Anatomical Amphibian Head Group
export const frogHeadGroup = new THREE.Group();
frogHeadGroup.position.set(0, 0.52, -0.32);
frogSquashGroup.add(frogHeadGroup);

const craniumGeo = new THREE.SphereGeometry(0.52, 28, 22);
const cPos = craniumGeo.attributes.position;
for (let i = 0; i < cPos.count; i++) {
  let vx = cPos.getX(i);
  let vy = cPos.getY(i);
  let vz = cPos.getZ(i);
  if (vz < 0) {
    const snoutT = Math.min(1, -vz / 0.52);
    vx *= (1.18 - snoutT * 0.48);
    vy *= (0.68 - snoutT * 0.28);
    vz *= 1.28;
  } else {
    vx *= 1.18;
    vy *= 0.68;
  }
  if (vy < -0.05) vy = -0.05 + (vy + 0.05) * 0.25;
  cPos.setXYZ(i, vx, vy, vz);
}
craniumGeo.computeVertexNormals();

const upperHeadMesh = new THREE.Mesh(craniumGeo, frogBodyMat);
upperHeadMesh.position.set(0, 0.06, -0.04);
upperHeadMesh.castShadow = true;
frogHeadGroup.add(upperHeadMesh);

export const frogEyelids = [];

[-1, 1].forEach((side) => {
  const eyeMount = new THREE.Group();
  eyeMount.position.set(side * 0.34, 0.26, -0.10);
  eyeMount.rotation.y = -side * 0.32;
  eyeMount.rotation.z = -side * 0.14;

  const browHood = new THREE.Mesh(
    new THREE.SphereGeometry(0.215, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
    frogBodyMat
  );
  browHood.rotation.x = -0.38;
  browHood.rotation.z = -side * 0.22;
  browHood.castShadow = true;
  eyeMount.add(browHood);

  const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.195, 20, 16), eyeCrimsonMat);
  eyeMount.add(eyeball);

  const slitPupil = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), pupilMat);
  slitPupil.scale.set(0.34, 1.18, 0.55);
  slitPupil.position.set(0, 0.01, -0.155);
  eyeMount.add(slitPupil);

  const primaryShine = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), catchlightMat);
  primaryShine.position.set(side * 0.045, 0.065, -0.185);
  eyeMount.add(primaryShine);

  const secondaryShine = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), catchlightMat);
  secondaryShine.position.set(-side * 0.035, -0.045, -0.188);
  eyeMount.add(secondaryShine);

  const eyelid = new THREE.Mesh(new THREE.SphereGeometry(0.205, 16, 12), frogBodyMat);
  eyelid.scale.set(1, 0.05, 1);
  eyelid.visible = false;
  eyeMount.add(eyelid);
  frogEyelids.push(eyelid);

  frogHeadGroup.add(eyeMount);

  const tympanum = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.02, 14), frogTympanumMat);
  tympanum.rotation.z = Math.PI * 0.5;
  tympanum.rotation.y = -side * 0.25;
  tympanum.position.set(side * 0.50, 0.06, 0.08);
  frogHeadGroup.add(tympanum);

  const nostrilBump = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), frogBodyMat);
  nostrilBump.position.set(side * 0.14, 0.11, -0.54);
  frogHeadGroup.add(nostrilBump);

  const nostrilPit = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), pupilMat);
  nostrilPit.position.set(side * 0.145, 0.115, -0.568);
  frogHeadGroup.add(nostrilPit);
});

const mouthLine = new THREE.Mesh(
  new THREE.TorusGeometry(0.46, 0.014, 8, 24, Math.PI * 0.85),
  frogTympanumMat
);
mouthLine.rotation.x = Math.PI * 0.52;
mouthLine.rotation.z = Math.PI * 0.075;
mouthLine.scale.set(1.06, 1.24, 0.65);
mouthLine.position.set(0, -0.01, -0.08);
frogHeadGroup.add(mouthLine);

export const jawPivot = new THREE.Group();
jawPivot.position.set(0, -0.02, 0.02);

const lowerJawGeo = new THREE.SphereGeometry(0.48, 24, 16);
const ljPos = lowerJawGeo.attributes.position;
for (let i = 0; i < ljPos.count; i++) {
  let vx = ljPos.getX(i);
  let vy = ljPos.getY(i);
  let vz = ljPos.getZ(i);
  if (vz < 0) {
    const snoutT = Math.min(1, -vz / 0.48);
    vx *= (1.12 - snoutT * 0.46);
    vz *= 1.26;
  }
  vy *= 0.26;
  if (vy > 0.02) vy = 0.02;
  ljPos.setXYZ(i, vx, vy, vz);
}
lowerJawGeo.computeVertexNormals();

const lowerJawMesh = new THREE.Mesh(lowerJawGeo, frogBellyMat);
lowerJawMesh.position.set(0, -0.02, -0.05);
jawPivot.add(lowerJawMesh);

export const vocalSac = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 16), frogBellyMat);
vocalSac.scale.set(1.05, 0.52, 1.05);
vocalSac.position.set(0, -0.11, -0.22);
jawPivot.add(vocalSac);

frogHeadGroup.add(jawPivot);

// Forelimbs
[-1, 1].forEach((side) => {
  const armGroup = new THREE.Group();
  armGroup.position.set(side * 0.44, 0.30, -0.22);

  const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.072, 0.28, 12), frogBodyMat);
  upperArm.position.set(side * 0.08, -0.06, 0.02);
  upperArm.rotation.z = side * 0.48;
  upperArm.rotation.x = 0.25;
  upperArm.castShadow = true;
  armGroup.add(upperArm);

  const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.076, 10, 10), frogBodyMat);
  elbow.position.set(side * 0.14, -0.15, 0.05);
  armGroup.add(elbow);

  const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.058, 0.26, 12), frogBodyMat);
  forearm.position.set(side * 0.09, -0.21, -0.08);
  forearm.rotation.z = -side * 0.32;
  forearm.rotation.x = -0.62;
  forearm.castShadow = true;
  armGroup.add(forearm);

  const handGroup = new THREE.Group();
  handGroup.position.set(side * 0.04, -0.26, -0.20);
  [-0.38, -0.12, 0.16, 0.42].forEach((fAngle, fIdx) => {
    const fingerLen = fIdx === 1 || fIdx === 2 ? 0.19 : 0.15;
    const fingerPivot = new THREE.Group();
    fingerPivot.rotation.y = fAngle - side * 0.15;

    const digit = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, fingerLen, 8), frogToeOrangeMat);
    digit.rotation.x = Math.PI * 0.48;
    digit.position.z = -fingerLen * 0.5;
    fingerPivot.add(digit);

    const toePad = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), frogToeOrangeMat);
    toePad.scale.set(1.15, 0.55, 1.25);
    toePad.position.set(0, -0.005, -fingerLen);
    fingerPivot.add(toePad);

    handGroup.add(fingerPivot);
  });
  armGroup.add(handGroup);
  frogSquashGroup.add(armGroup);
});

// Hindlimbs
export const hindLegs = [];
[-1, 1].forEach((side) => {
  const legGroup = new THREE.Group();
  legGroup.position.set(side * 0.42, 0.28, 0.34);

  const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 14), frogBodyMat);
  thigh.scale.set(0.68, 0.62, 1.65);
  thigh.position.set(side * 0.16, 0.05, -0.14);
  thigh.rotation.y = -side * 0.42;
  thigh.rotation.x = 0.28;
  thigh.castShadow = true;
  legGroup.add(thigh);

  const knee = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 10), frogBodyMat);
  knee.position.set(side * 0.28, 0.11, -0.34);
  legGroup.add(knee);

  const calf = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), frogBodyMat);
  calf.scale.set(0.58, 0.54, 1.68);
  calf.position.set(side * 0.22, -0.04, -0.10);
  calf.rotation.y = side * 0.18;
  calf.rotation.x = -0.36;
  calf.castShadow = true;
  legGroup.add(calf);

  const footGroup = new THREE.Group();
  footGroup.position.set(side * 0.18, -0.22, 0.02);
  [-0.36, -0.12, 0.12, 0.36].forEach((tAngle, tIdx) => {
    const toeLen = tIdx === 2 ? 0.28 : tIdx === 1 ? 0.25 : 0.20;
    const toePivot = new THREE.Group();
    toePivot.rotation.y = tAngle - side * 0.18;

    const toeDigit = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.032, toeLen, 8), frogToeOrangeMat);
    toeDigit.rotation.x = Math.PI * 0.49;
    toeDigit.position.z = -toeLen * 0.5;
    toePivot.add(toeDigit);

    const toePad = new THREE.Mesh(new THREE.SphereGeometry(0.046, 10, 8), frogToeOrangeMat);
    toePad.scale.set(1.2, 0.52, 1.3);
    toePad.position.set(0, -0.005, -toeLen);
    toePivot.add(toePad);

    footGroup.add(toePivot);
  });
  legGroup.add(footGroup);

  frogSquashGroup.add(legGroup);
  hindLegs.push(legGroup);
});

// Ribbon Tongue
export const tongueRibbonMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.105, 1, 12), tongueMat);
tongueRibbonMesh.geometry.rotateX(Math.PI / 2);
tongueRibbonMesh.visible = false;

export const tongueTipGroup = new THREE.Group();
tongueTipGroup.visible = false;
[-0.08, 0.08].forEach((lx) => {
  const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), tongueMat);
  lobe.scale.set(1.1, 0.55, 1.3);
  lobe.position.x = lx;
  tongueTipGroup.add(lobe);
});
