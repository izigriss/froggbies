# AI Tools Disclosure Notice

**Project**: Froggbies: Sky and Abyss  
**Author**: Naimish Singh  
**Date**: October 2026  
**License**: MIT  

---

## Declaration of Generative AI and Assisted Development

This disclosure statement complies with competition requirements, open-source compliance standards, and academic submission guidelines regarding the transparency of Artificial Intelligence (AI) tools utilized in this project.

### 1. AI Tools Utilized

- **Claude Code**: Terminal-based autonomous coding agent by Anthropic used for modular refactoring, file architecture, and build pipeline setup.
- **JetBrains AI Assistant / Junie**: In-IDE agentic assistant powering codebase inspection, type checking, and code navigation within WebStorm / IntelliJ IDEA.
- **Gemini**: Used for procedural mathematical formulations, Three.js geometry scripting, and Web Audio API oscillator synthesis.

---

### 2. Specific Scope and Parts of the Project

The AI tools were utilized under the direction and supervision of the author across the following specific parts of the project:

| Tool / Assistant | Scope & Parts of the Project |
| :--- | :--- |
| **Claude Code** | • Modular repository refactoring: dispersed monolithic single-file code into clean ES modules (`src/audio.js`, `src/textures.js`, `src/game.js`, `src/ui.js`, `css/style.css`).<br>• Production tooling & CI/CD: configured Vite multi-page bundling, npm test verification runner (`scripts/validate.js`), and GitHub Actions deployment. |
| **JetBrains AI Assistant / Junie** | • IDE-level code analysis, linting verification, parameter auto-completion, and cross-module reference auditing in WebStorm / IntelliJ. |
| **Gemini** | • Assisted in formulating procedural Three.js character geometries, dynamic log rolling rotational physics, and GLSL water ripple vertex/fragment shaders.<br>• Assisted in calculating oscillator frequency ramps, exponential decay envelopes, and harmonic chords for real-time procedural sound effects. |

---

### 3. Human Direction and Validation

All game architecture, visual aesthetics, timing curves, audio synthesis parameters, gameplay balance, and project configurations were iteratively directed, reviewed, tested, and validated by **Naimish Singh** to ensure optimal performance and zero software regressions.
