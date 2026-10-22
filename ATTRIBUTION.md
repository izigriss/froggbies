# Attribution and Third-Party Asset Notices

This project, **Froggbies: Sky and Abyss**, adheres to open-source compliance standards and transparently discloses all third-party libraries, assets, conceptual inspirations, and AI tool usage.

---

## 1. Third-Party Libraries, Frameworks & Fonts

The following external libraries and typography assets are loaded via secure public CDNs:

| Asset / Library | Version | Source / CDN Repository | Purpose | License & Copyright |
| :--- | :--- | :--- | :--- | :--- |
| **Three.js** | `r128` | • [cdnjs CDN](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js)<br>• [GitHub Repository](https://github.com/mrdoob/three.js) | 3D WebGL renderer, scene graph hierarchy, perspective camera, lighting, raycaster targeting, and custom shader materials. | **MIT License**<br>Copyright (c) 2010-2026 Three.js Authors (Ricardo Cabello / mrdoob) |
| **Tailwind CSS** | `3.4.17` | • [Tailwind CDN](https://cdn.tailwindcss.com/3.4.17)<br>• [GitHub Repository](https://github.com/tailwindlabs/tailwindcss) | Rapid utility CSS styling for HUD overlays, tactile 3D buttons, and responsive layout constraints. | **MIT License**<br>Copyright (c) Tailwind Labs, Inc. |
| **Fredoka Font** | Variable | • [Google Fonts](https://fonts.google.com/specimen/Fredoka)<br>• [GitHub Specimen](https://github.com/haank/Fredoka-One) | Heavy, tactile arcade typography for title display, combo counters, and game-over statistics. | **SIL Open Font License 1.1**<br>Copyright (c) 2011 Milena Brandao |
| **Inter Font** | Variable | • [Google Fonts](https://fonts.google.com/specimen/Inter)<br>• [GitHub Repository](https://github.com/rsms/inter) | High-legibility UI typography for HUD labels, control hints, and field guide modal dialogs. | **SIL Open Font License 1.1**<br>Copyright (c) 2016-2026 Rasmus Andersson |

---

## 2. In-Engine Procedural Generation (Zero External Files)

To minimize bundle size, eliminate external latency, and ensure 100% offline self-containment, all graphics, 3D meshes, textures, and sounds are mathematically generated at runtime in procedural code:

### Visual Assets & 3D Geometry
- **Character Geometry**: The frog is procedurally constructed using composite Three.js primitives (`SphereGeometry`, `CylinderGeometry`, `BoxGeometry`) with animated skeletal limb pivots, blinking eye lids, and dynamic jaw motion.
- **River Hazards & Platforms**: Lily pads, rolling cedar logs with procedural bark striations, spring mushrooms, whirlpool vortices, murder hornets, and luminous fireflies are all procedurally synthesized.
- **Procedural Canvas Textures**:
  - Amphibian dorsal skin texture generated with organic pore distribution and leopard spots.
  - River water normal/bump map generated via randomized elliptical ripples.
  - Cedar log bark generated with layered linear gradient striations and lichen splotches.
  - Granite canyon cliffs generated with multi-pass randomized noise stippling.
- **Shaders**: Custom GLSL vertex displacement and fragment foam rim lighting for realistic water flow.

### Procedural Audio Engine
- **Web Audio API**: All sound effects (spring leaping, river splashes, tongue grapple snatch, 5x combo fever shockwave, firefly collect chime, bee stings, and wipeout bubbling) are synthesized on-the-fly using native browser `AudioContext` oscillators (sine, square, triangle, sawtooth waves) and exponential gain decay envelopes.
- **No external `.mp3`, `.ogg`, or `.wav` audio files** are used or included.

---

## 3. Game Concept & Genre Inspiration

- **Arcade River-Crossing Genre**: Gameplay loop broadly draws genre inspiration from classic river-crossing arcade mechanics (*Frogger*, *Crossy Road*), developed into an original 3D canyon action runner featuring procedural rapid generation, real-time log roll balancing physics, tongue grapple targeting, 5x fever combos, and multi-season biome transitions.

---

## 4. AI Tools Disclosure

In accordance with competition rules and transparency guidelines:

| AI Tool / Assistant | Scope & Parts of the Project |
| :--- | :--- |
| **Claude Code** | • Modular architecture refactoring: structured monolith into separate ES modules (`src/`, `css/`).<br>• Tooling & validation: Vite bundling configuration, integrity verification script (`scripts/validate.js`), and GitHub Actions CI. |
| **JetBrains AI Assistant / Junie** | • IDE-level code analysis, linting verification, parameter auto-completion, and codebase inspection. |
| **Gemini** | • Assisted with procedural Three.js character geometries, log roll rotational physics, and GLSL wave shaders.<br>• Assisted in Web Audio oscillator frequency calculations and audio envelope curves. |

---

## 5. Software License

The source code and project assets are licensed under the **MIT License**.
See the [LICENSE](LICENSE) file in the root directory for the complete license text.

Copyright (c) 2026 **Naimish Singh**. All rights reserved.
