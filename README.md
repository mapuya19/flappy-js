# Flappy JS - Modern Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modernized Flappy Bird game built with vanilla JavaScript and the Canvas API. Originally created in 2020 with Processing and p5.js, completely rebuilt in 2026 with modern best practices while preserving the original gameplay feel.

![Flappy JS](flappy-js.png)

## Features

- **Modern Tech Stack**: Vanilla JavaScript ES6+ with Canvas API (no heavy frameworks)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Touch Controls**: Tap anywhere to play on mobile, spacebar or click on desktop
- **High Score System**: Persistent high scores using localStorage
- **Visual Polish**: Particle effects, screen shake, and parallax backgrounds
- **Modern Development**: Vite for fast dev server and optimized production builds
- **Code Quality**: ESLint for consistent code style
- **Performance**: Optimized rendering with ~11KB gzipped bundle size

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:5173` to play in development mode.

## Gameplay / Controls

- **Desktop**: Space bar or left mouse click to jump
- **Mobile**: Tap anywhere on screen to jump
- **Objective**: Navigate through the gaps between pipes without hitting them or the ground
- **High Score**: Your best score is automatically saved locally

## Project Structure

```
src/
├── main.js                 # Entry point and canvas initialization
├── Game.js                 # Main game controller, state management, input handling
├── Bird.js                 # Bird entity with original artwork and animations
├── Tubes.js                # Pipe obstacles with 3D rendering and collision detection
├── Score.js                # Score display with styled text
└── utils/
    ├── Background.js       # Parallax background with city skyline and clouds
    ├── ParticleSystem.js   # Visual effects for jump, score, and collision
    ├── ScreenShake.js      # Screen shake effect on death
    ├── audio.js            # Sound loading and management
    └── storage.js          # LocalStorage high score persistence

Reference:
├── Flappy.js               # Original 2020 p5.js implementation (kept for reference)
```

## Technical Highlights

### Modern Architecture

- **ES6 Classes**: Proper encapsulation with class-based entity system
- **Modular Code**: ES6 imports for clean dependency management
- **RequestAnimationFrame**: Smooth gameplay with delta time
- **State Management**: Menu, Ready, Playing, and Game Over states
- **Async Asset Loading**: Game loop waits for all assets to load

### Physics & Mechanics (Preserved from Original)

- **Gravity**: 0.15 (tuned for responsive feel)
- **Jump Force**: -4.6 (satisfying upward impulse)
- **Pipe Gap**: 130px (playable balance)
- **Pipe Speed**: 1.5 (relaxed pacing)
- **Collision Detection**: Based on visual bird position with radius-based hitbox
- **Score Timing**: Increments at pipe midpoint, matching original behavior

### Visual Implementation

- **Bird**: Original Flappy Bird style with yellow body, orange beak, animated wing
- **Pipes**: 3D shaded rendering with caps matching original game
- **Parallax Background**: Sky gradient, city skyline, clouds, and textured ground
- **Text Styling**: 4px black stroke outlines for readability (60px titles, 32px instructions)
- **Effects**: Particles on jump/score/death, screen shake on collision

### Performance

- Optimized canvas rendering
- Efficient collision detection
- Minimal bundle size (~11KB gzipped)
- Tree-shaking removes unused code

### Accessibility

- Keyboard support (space bar)
- Touch-friendly interface
- Clear visual feedback
- High contrast text with outlines

## Migration from p5.js

This project was migrated from p5.js v1.0.0 to native Canvas API. Key changes:

- **Canvas API**: Direct canvas rendering instead of p5.js abstraction layer
- **State Management**: Explicit game states instead of p5.js draw loop
- **Input Handling**: Native event listeners for mouse, keyboard, and touch
- **Asset Loading**: Async loading with Promise.all for initialization
- **Build System**: Vite replaces manual script includes

The original `Flappy.js` file is preserved for reference.

## Development

The project uses:

- **Vite** - Fast development server with HMR and optimized production builds
- **Vanilla JavaScript** - ES6+ with modules and classes
- **Canvas API** - Native browser 2D rendering
- **localStorage** - Client-side high score persistence
- **ESLint** - Code linting for consistent style

### Available Scripts

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

### Build Output

The production build is optimized for performance:

- Code minification
- Source maps for debugging
- Tree-shaking to remove unused code
- Fast loading with Vite's optimized build

Built files are in the `dist/` directory.

## Troubleshooting

**Game doesn't start / blank screen**
- Ensure all assets are loaded (check browser console for errors)
- Verify the canvas is properly sized for your screen

**Touch controls not working on mobile**
- Ensure you're tapping the canvas area
- Check that touch events are not blocked by browser settings

**High scores not saving**
- Verify localStorage is enabled in your browser
- Check browser privacy/incognito settings

**Performance issues**
- Try reducing window size (larger canvas = more pixels to render)
- Ensure hardware acceleration is enabled in browser

## Original Version

The original 2020 version was built with Processing and p5.js v1.0.0. You can find the Processing version [here](https://github.com/mapuya19/flappy).

## License

MIT

## Credits

Built with modern web technologies and best practices from 2026.

Original game concept by Dong Nguyen (dotGEARS).
