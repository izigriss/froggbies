# Attribution and Third-Party Notices

This project, **Froggbies: Sky and Abyss**, adheres to open-source compliance standards and transparently discloses all third-party libraries, assets, inspirations, and AI tools used.

---

## 1. Third-Party Libraries and Fonts

| Asset / Library | Version | Source / CDN | Purpose | License |
| :--- | :--- | :--- | :--- | :--- |
| **Three.js** | r128 | [cdnjs CDN](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js) / [GitHub](https://github.com/mrdoob/three.js) | 3D WebGL rendering, scene graph, cameras, lighting, raycasting, mesh creation, and custom shader materials | [MIT License](https://github.com/mrdoob/three.js/blob/dev/LICENSE) |
| **Tailwind CSS** | 3.4.17 | [Tailwind CDN](https://cdn.tailwindcss.com/3.4.17) / [GitHub](https://github.com/tailwindlabs/tailwindcss) | Responsive layout, UI overlays, HUD typography, tactile button styling | [MIT License](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE) |
| **Fredoka Font** | Variable | [Google Fonts](https://fonts.google.com/specimen/Fredoka) | Chunky arcade title and HUD numerical typography | [SIL Open Font License 1.1](https://openfontlicense.org/) |
| **Inter Font** | Variable | [Google Fonts](https://fonts.google.com/specimen/Inter) | Clean interface body text and instruction guides | [SIL Open Font License 1.1](https://openfontlicense.org/) |

---

## 2. Procedural Assets (Visual & Audio)

All in-game graphics, 3D meshes, textures, and sound effects are **100% procedurally generated in code** without relying on external proprietary asset packs or pre-recorded audio files:

- **3D Geometry & Models**:
  - Procedural Frog Character: Built entirely using composite Three.js primitives (`SphereGeometry`, `CylinderGeometry`, `BoxGeometry`) with animated limb pivots and eye blinks.
  - River Environments & Hazards: Procedural lily pads, cedar logs, spring mushrooms, whirlpools, murder hornets, and luminous fireflies created through native Three.js geometry classes.
  - Shaders: Custom GLSL vertex and fragment shaders for real-time water wave propagation and foam rim lighting.
- **Audio & Sound FX**:
  - Procedural Web Audio API: All game audio (spring leaps, water splashes, tongue whip grapple, combo shockwaves, firefly chime collects, hornet sting buzz, wipeout sounds) is synthesized in real time via native browser `AudioContext` oscillators (sine, square, triangle, sawtooth) and biquad filter sweeps.
  - Zero external MP3, OGG, or WAV audio files were used.

---

## 3. Game Concept & Inspirations

- Conceptually inspired by classic arcade river crossing games (such as *Frogger* by Konami and *Crossy Road* by Hipster Whale), transformed into an intense 3D roguelike canyon runner featuring log balance physics, tongue grappling mechanics, seasonal biome cycling, dynamic combo fever meters, and real-time raycasting controls.

---

## 4. AI Tools Disclosure

In accordance with competition and transparency guidelines, the following AI tools and their specific roles are disclosed:

| AI Tool / Model | Scope & Part of Project |
| :--- | :--- |
| **Google Gemini 3.8 Flash (High)** via **Antigravity Agentic IDE** | • Procedural 3D scene design & Three.js geometry scripting<br>• Custom GLSL water surface shaders & canyon environmental biome transitions<br>• Real-time procedural Web Audio synthesizer oscillator formulas<br>• Responsive game HUD, tactile arcade controls, and touch/raycast event architecture<br>• Game state machine logic, collision detection, combo score multipliers, and local storage persistence<br>• Code optimization, linting validation, and project documentation (README, ATTRIBUTION, LICENSE) |

---

## 5. Software License

The source code for **Froggbies: Sky and Abyss** is open source and available under the terms of the [MIT License](LICENSE).
