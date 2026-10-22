# 🐸 Froggbies: Sky and Abyss

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](package.json)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Three.js%20%7C%20HTML5-blue.svg)](index.html)
[![Audio](https://img.shields.io/badge/Audio-Procedural%20Web%20Audio%20API-purple.svg)](index.html)
[![Assets](https://img.shields.io/badge/Assets-100%25%20Procedural%20Code-orange.svg)](ATTRIBUTION.md)

> A fast-paced, tactile 3D arcade river action game running entirely in the browser. Leap across treacherous rapids, balance on tilting cedar logs, snap flies with your grappling tongue, and trigger combo shockwaves through shifting seasonal canyon biomes.

---

## 🎮 Play & Gameplay Features

- **Dynamic Procedural 3D Rapids**: Infinite forward-scrolling canyon river with real-time GLSL water displacement and foam edge shaders.
- **Physics-Driven Platforms**:
  - 🍃 **Lily Pads**: Stable resting stones.
  - 🪵 **Slippery Cedar Logs**: Drift downstream with lateral roll; players must actively balance using directional controls.
  - 🍄 **Spring Mushrooms**: High-velocity trampoline bouncers that catapult the frog forward two steps.
  - 🌀 **Whirlpools**: Violent aquatic vortexes that drag you down if you linger for more than 1.25s.
- **Grappling Tongue Mechanic**: Click on flying insects or press `ENTER` to whip out a real-time 3D spring tongue and snatch targets out of midair.
- **Combo Fever Shockwaves**: Chain clean consecutive leaps to fill your fever gauge; unleashing a 5x combo triggers an explosive shockwave that clears hazards and magnetizes collectibles.
- **Four Seasonal Biomes**: Real-time atmospheric color transitions between **Verdant Spring**, **Crimson Autumn**, **Frozen Tundra**, and **Neon Twilight**.
- **100% Procedural Synthesized Sound**: All bounces, water splashes, tongue snaps, and combo chimes are mathematically synthesized in real time via the Web Audio API—no downloaded audio files needed.
- **Tactile Diegetic HUD**: Zero-blur arcade interface with responsive desktop and mobile touch controls.

---

## 🕹️ Controls

| Action | Keyboard | Mouse / Pointer | Touch (Mobile/Tablet) |
| :--- | :--- | :--- | :--- |
| **Leap Forward** | `SPACE` | Click target platform in 3D | Tap target platform |
| **Grapple Tongue** | `ENTER` | Click flying insect in 3D | Tap flying insect |
| **Log Balance (Left / Right)** | `A` / `D` or `←` / `→` | Click left/right HUD buttons | Swipe or tap on-screen tilt buttons |
| **Switch Season (Debug / Style)**| `B` | — | — |
| **Mute / Unmute Audio** | `M` | Click 🔊 HUD button | Tap 🔊 HUD button |
| **Pause / Resume** | `P` or `ESC` | Click ⏸️ HUD button | Tap ⏸️ HUD button |

---

## 🚀 Build and Run Instructions

The project is completely self-contained with **zero required compilation steps** or heavy build chains. It can be run instantly in any modern web browser supporting WebGL and Web Audio API.

### Option 1: Direct Browser Launch (Fastest / Zero Install)
Simply open the entry point file directly in your browser:
- Double-click `index.html` (or `m2.html`), or open via terminal:
  - **macOS / Linux**: `open index.html` or `xdg-open index.html`
  - **Windows**: `start index.html`

### Option 2: Run via Node.js / NPM (Recommended for Local Dev)
Make sure [Node.js](https://nodejs.org/) (v16+) is installed:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/froggbies-sky-and-abyss.git
cd froggbies-sky-and-abyss

# 2. Run local web server
npm start
# or:
npx serve . -l 3000
```
Open your browser at: **`http://localhost:3000`**

### Option 3: Run via Python 3
If Python is installed on your machine:
```bash
# In the project directory:
python -m http.server 8000
```
Open your browser at: **`http://localhost:8000`**

### Option 4: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (`ritwickdey.liveserver`).
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option 5: GitHub Pages (Online Hosted)
1. Go to repository **Settings** > **Pages**.
2. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
3. Click **Save**. Your game will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🧪 Testing and Validation

Automated syntax and structural sanity tests are built into `package.json`:

```bash
# Runs entry-point validation and JavaScript parser check
npm test
```

---

## 📦 Third-Party Assets & Libraries

All external dependencies are loaded from trusted public CDNs and licensed under permissive open-source terms:

| Dependency | Version | Source / CDN | Purpose | License |
| :--- | :--- | :--- | :--- | :--- |
| **Three.js** | r128 | [cdnjs Three.js](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js) | 3D WebGL renderer, scene graph, raycasting, camera, procedural geometry | [MIT License](https://github.com/mrdoob/three.js/blob/dev/LICENSE) |
| **Tailwind CSS** | 3.4.17 | [Tailwind CDN](https://cdn.tailwindcss.com/3.4.17) | Utility CSS styling for HUD overlays and responsive typography | [MIT License](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE) |
| **Fredoka Font** | Google Fonts | [Google Fonts Fredoka](https://fonts.google.com/specimen/Fredoka) | Chunky arcade title and HUD numerical typography | [SIL Open Font License 1.1](https://openfontlicense.org/) |
| **Inter Font** | Google Fonts | [Google Fonts Inter](https://fonts.google.com/specimen/Inter) | Clean UI text, field guides, and dialog content | [SIL Open Font License 1.1](https://openfontlicense.org/) |

> **Note on Graphics & Audio Assets**:
> - **Visual Assets**: No external 3D models (GLTF/GLB) or raster textures are loaded. All meshes (frog, lily pads, cedar logs, mushrooms, hornets, particles) are generated procedurally using native Three.js primitives and custom GLSL water shaders.
> - **Audio Assets**: No external sound files (`.mp3`, `.wav`) are imported. All sound effects are procedurally generated in real time using the browser's native Web Audio API oscillators and gain envelopes.

See [ATTRIBUTION.md](ATTRIBUTION.md) for full compliance details.

---

## 🤖 AI Tools Disclosure

In accordance with competition rules and transparency best practices, the following AI tools and their specific roles are disclosed:

| Tool / Model | Scope & Part of Project |
| :--- | :--- |
| **Google Gemini 3.8 Flash (High)** via **Antigravity Agentic IDE** | • **3D Scene & Shader Architecture**: Generated procedural Three.js character geometry, dynamic log roll physics, and custom GLSL water ripple shaders.<br>• **Procedural Sound Engine**: Synthesized real-time Web Audio API oscillator formulas for leap springs, splashes, hornet stings, and combo fever blasts.<br>• **Tactile UI & HUD System**: Implemented responsive Tailwind CSS tactile buttons, combo gauges, and diegetic game controls.<br>• **Game State & Logic**: Programmed state transitions, raycast click targeting, log balance mechanics, and local storage record keeping.<br>• **Documentation & Packaging**: Authored build instructions, compliance attribution files, and repository configuration. |

---

## ⚖️ Attribution Notice & License

- **Attribution Notice**: Inspired by the core mechanics of classic arcade river crossers (*Frogger*, *Crossy Road*), expanded into a high-speed 3D arcade roguelite with real-time log balance, tongue grapple aiming, and fever combos.
- **License**: This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 📌 Submission Checklist

- [x] Repository buildable and runnable from root (`index.html`, `npm start`, Python server).
- [x] Updated `README.md` with full build, run, and control instructions.
- [x] Permissive [LICENSE](LICENSE) file (MIT License) included.
- [x] Dedicated [ATTRIBUTION.md](ATTRIBUTION.md) file included.
- [x] Full disclosure of third-party assets, sources, and licenses.
- [x] Transparent disclosure of AI tools and specific contributions.
- [x] **Repository Visibility**: Kept **public until at least October 30** as required by submission guidelines.
