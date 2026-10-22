# 🐸 Froggbies: Sky and Abyss

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](package.json)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Three.js%20%7C%20WebGL-blue.svg)](index.html)
[![Audio](https://img.shields.io/badge/Audio-Procedural%20Web%20Audio%20API-purple.svg)](index.html)
[![Assets](https://img.shields.io/badge/Assets-100%25%20Procedural%20Code-orange.svg)](ATTRIBUTION.md)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF.svg)](vite.config.js)
[![Visibility](https://img.shields.io/badge/Visibility-Public%20(thru%20Oct%2030+)-success.svg)](#-repository-visibility-guarantee)

> **Froggbies: Sky and Abyss** is a high-velocity, tactile 3D procedural arcade river runner running entirely in the browser. Leap across roaring canyon rapids, master real-time cedar log balancing physics, whip a 3D grappling spring tongue to capture fireflies, and unleash 5x Fever shockwaves across shifting seasonal biomes.

## 🎮 Gameplay & Technical Highlights

- **Dynamic Procedural 3D Rapids**: Infinite forward-scrolling river canyon with real-time GLSL water displacement and foam edge shaders.
- **Physics-Driven Platforms**:
  - 🍃 **Lily Pads**: Flat, stable resting surfaces.
  - 🪵 **Cedar Logs**: Drift laterally with rotational inertia; players must actively balance using `A`/`D` or arrow keys.
  - 🍄 **Spring Mushrooms**: High-velocity trampoline bouncers catapulting the frog forward two steps.
  - 🌀 **Whirlpools**: Violent aquatic vortexes that drag you down if you linger for more than 1.25s.
- **Grappling Tongue Mechanic**: Click flying insects in 3D space or press `ENTER` to whip a spring-animated tongue and snatch targets out of midair.
- **5x Combo Fever Shockwaves**: Chain consecutive quick leaps to charge the fever gauge; triggering a 5x combo unleashes an explosive radial shockwave that neutralizes hazards and magnetizes collectibles.
- **Four Seasonal Biomes**: Real-time atmospheric lighting and fog transitions between **Sky and Abyss (Sunny)**, **Monsoon Storm**, **Alpine Frost**, and **Firefly Night**.
- **100% Procedural Synthesized Sound**: All bounces, water splashes, tongue snaps, and combo chimes are mathematically synthesized in real time via the browser's native Web Audio API—no downloaded audio files needed.
- **Zero-Blur Tactile Arcade HUD**: Crisp 3D extruded typography and diegetic controls optimized for desktop keyboard/mouse and mobile touch.

---

## 🕹️ Controls Guide

| Action | Keyboard | Mouse / Pointer | Touch (Mobile/Tablet) |
| :--- | :--- | :--- | :--- |
| **Leap Forward** | `SPACE` | Click target platform in 3D | Tap target platform |
| **Grapple Tongue** | `ENTER` | Click flying insect in 3D | Tap flying insect |
| **Log Balance (Left / Right)** | `A` / `D` or `←` / `→` | Click left/right HUD buttons | Swipe or tap on-screen tilt buttons |
| **Switch Weather / Season** | `B` | Click 🌦️ Weather HUD button | Tap 🌦️ Weather HUD button |
| **Mute / Unmute Audio** | `M` | Click 🔊 Mute HUD button | Tap 🔊 Mute HUD button |
| **Pause / Field Guide** | `P` or `ESC` | Click ⏸️ Pause HUD button | Tap ⏸️ Pause HUD button |

---

## 🚀 Build and Run Instructions

This project is completely buildable and runnable directly from this repository. It supports both **zero-install direct running** and **modern production bundling** via Vite.

### Prerequisites
- Modern web browser with WebGL and Web Audio API support (Chrome, Edge, Firefox, Safari).
- *(Optional for build tooling)*: [Node.js](https://nodejs.org/) v18.0.0+ and `npm`.

---

### Method 1: Local Development Server (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/izigriss/froggbies.git
cd froggbies-sky-and-abyss

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

### Method 2: Production Build & Preview

```bash
# Compile and optimize production bundle into /dist
npm run build

# Preview the production build locally
npm run preview
```

The production output is generated in `./dist/index.html` (along with `./dist/froggbies.html`), completely minified and ready for CDN or static deployment.

---

### Method 3: Instant Zero-Install Direct Run

No Node.js or build tools required! Simply open the standalone single-file build in any browser:

- **macOS**: `open dist/froggbies.html`
- **Linux**: `xdg-open dist/froggbies.html`
- **Windows**: `start dist/froggbies.html` (or double-click `dist/froggbies.html` in File Explorer)

Or via Python's built-in static HTTP server:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000`.

---

## 🧪 Testing and Integrity Validation

To guarantee zero regression and verify repository integrity, an automated test suite validates DOM nodes, CDN dependencies, and JavaScript syntax:

```bash
npm test
```

Expected output:
```
--- Running Froggbies Game Repository Integrity Verification ---
PASS: All 28 required HUD/Game DOM elements verified in index.html.
PASS: All external CDN libraries and fonts verified in index.html.
PASS: All 11 modular source files exist and verified.
PASS: dist/froggbies.html verified as intact standalone single-file build.
--- All Verification Tests Passed Successfully! ---
```

---

## 📁 Repository Structure

```
c:/ace/m2/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD test, build, and Pages deployment
├── css/
│   └── style.css              # Extracted tactile arcade HUD styling & animations
├── dist/
│   └── froggbies.html         # Standalone single-file HTML build (direct browser launch)
├── scripts/
│   └── validate.js            # Automated integrity & DOM parser test script
├── src/
│   ├── audio.js               # Procedural Web Audio API sound synthesizer (SoundFX)
│   ├── constants.js           # Seasonal biomes, game dimensions & storage helpers
│   ├── game.js                # Core game mechanics, leaps, collisions & river cycle
│   ├── main.js                # Game orchestrator, render loop & event listeners
│   ├── materials.js           # Three.js shared materials & procedural geometries
│   ├── particles.js           # 3D water ripples, splash particles & score popups
│   ├── state.js               # Central game state management
│   ├── textures.js            # Procedural Canvas 2D PBR textures (skin, bark, rocks)
│   ├── ui.js                  # DOM HUD references, scorecard rollup & UI bindings
│   └── entities/
│       ├── environment.js     # Procedural river terrain, pads, logs, hornets & flies
│       └── frog.js            # Procedural 3D frog model, articulated limbs & tongue
├── .gitattributes             # Line-ending normalization rules
├── .gitignore                 # Build artifacts & dependency ignore patterns
├── LICENSE                    # MIT open-source license
├── README.md                  # Comprehensive project documentation (this file)
├── index.html                 # Clean modular game entry point
├── package.json               # Project manifest, dependencies, and build scripts
├── package-lock.json          # Deterministic dependency tree lockfile
└── vite.config.js             # Multi-page Vite production bundler configuration
```

---

## 📦 Attribution & Third-Party Notice

- **Libraries**: Three.js (`r128`, MIT) & Tailwind CSS (`3.4.17`, MIT).
- **Fonts**: Fredoka & Inter (Google Fonts, SIL Open Font License 1.1).
- **Assets**: 100% procedural in-engine generation. No external 3D models, textures, or audio recordings are imported.
- **Genre Inspiration**: Classic arcade river-crossing mechanics (*Frogger*, *Crossy Road*), developed into an original 3D action runner with dynamic log physics and 5x fever shockwaves.

---

## 🤖 AI Disclosure

In compliance with submission guidelines, the following AI tools and coding assistants were utilized:

- **Claude Code**: Terminal-based autonomous coding agent used for modular architecture refactoring, project restructuring, and build pipeline setup.
- **JetBrains AI Assistant / Junie**: In-IDE agentic assistant used for code analysis, linting verification, and cross-module inspection in WebStorm / IntelliJ IDEA.
- **Gemini**: Used for formulating procedural Three.js character geometries, log roll rotational physics, and Web Audio API synthesizer frequency calculations.

---

## ⚖️ License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full license text.

Copyright (c) 2026 **Naimish Singh**.
