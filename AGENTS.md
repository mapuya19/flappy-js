# Agent Guidelines for Flappy JS

## Overview

This is a modern Flappy Bird clone built with vanilla JavaScript, Canvas API, and Vite. The game uses a scene-based architecture with ES6 modules and follows specific patterns.

## Tech Stack

- **Runtime**: Vanilla JavaScript (ES6+) with ES Modules
- **Build Tool**: Vite
- **Rendering**: HTML5 Canvas API
- **Audio**: Web Audio API
- **Database**: Turso (SQLite-compatible)
- **Backend**: Cloudflare Worker (secure API proxy)
- **Linting**: ESLint
- **License**: MIT

## Essential Commands

```bash
npm run dev      # Start development server on port 3000
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint on src/
```

## Code Conventions

### File Structure
- `src/main.js` - Entry point, instantiates Game
- `src/Game.js` - Main game controller
- `src/Bird.js` - Bird entity class
- `src/Tubes.js` - Pipe obstacles manager
- `src/GameState.js` - Game state constants
- `src/scenes/` - All game scenes extend `BaseScene`
  - `LeaderboardScene.js` - Global leaderboard display
- `src/ui/` - UI components (Button, ScorePanel)
- `src/utils/` - Utilities (audio, background, ground, storage, etc.)
  - `leaderboard.js` - Leaderboard API client
- `workers/` - Cloudflare Worker for secure API proxy
- `wrangler.toml` - Cloudflare Worker configuration

### Imports
- Always use full file paths with `.js` extension
- Use `import { named } from './path/to/module.js'` for named exports
- Use `import Default from './path/to/module.js'` for default exports
- Use `export default class` for main classes
- Use `export class` for scene and utility classes

### Classes
- Use ES6 class syntax
- Default parameter values in constructors
- Config objects passed via constructor with destructuring: `constructor(config) { this.x = config.x || 90; }`
- Configuration constants defined at module level using UPPER_SNAKE_CASE for maintainability
- Reset methods named `reset()` for entity state restoration

### Constants
- Define all constants at the top of the file, before any class definitions
- Use UPPER_SNAKE_CASE naming convention
- Group related constants together in config objects (e.g., `GameConfig`, `BirdConfig`)
- Place module-level constants after imports but before class definitions

### Naming
- Class names: PascalCase
- Methods: camelCase
- Constants: UPPER_SNAKE_CASE (e.g., GameState.START)
- Private properties: prefix with `_` (not heavily used, but good practice)

### Variables
- `const` for all variables that aren't reassigned
- `let` only when reassignment is needed
- `var` is prohibited (ESLint rule)

### Functions
- Default parameters for optional arguments
- Destructuring in function parameters
- Optional chaining for potentially null/undefined calls: `this.sounds.wing?.play()`

### Error Handling
- Try-catch blocks for async operations (audio loading, asset fetching)
- Console warnings for non-critical failures
- Null checks before accessing optional features

## Architecture Patterns

### Scene System
All scenes extend `BaseScene` and implement these methods:
- `onEnter(...args)` - Called when scene becomes active
- `onExit()` - Called when scene is being left
- `update(deltaTime)` - Game loop updates
- `draw(ctx)` - Rendering
- `handleInput(x, y)` - Mouse/touch down or key press
- `handleRelease(x, y)` - Mouse/touch up

Scenes are registered in `Game.js` and accessed via game state transitions.

### Game Loop
- Delta time-based updates using `performance.now()`
- Capped at 1/30 seconds minimum (30 FPS) for consistency
- `requestAnimationFrame` for the loop
- Clear canvas before each frame

### Input Handling
- Mouse events: `mousedown`, `mouseup`
- Touch events: `touchstart`, `touchend` (passive: false)
- Keyboard: `Space`, `Enter` keys
- Coordinates transformed from screen to canvas space

### Asset Loading
- Sprite atlas loaded via `AtlasLoader`
- Assets referenced by name from atlas (atlas.png with atlas.json metadata)
- Use `import.meta.env.BASE_URL` for asset paths
- Loading state displayed until assets ready

### Audio
- Web Audio API with custom Sound wrapper class
- Audio context created on first play
- Resume context if suspended
- Gain node for volume control (default 0.3)
- Files: .m4a format for compression
- Scene transitions use swoosh sound effect for polish

### Sprite Rendering
- All game sprites drawn from a single sprite atlas
- Use `SpriteRenderer.drawSprite(name, x, y, options)` to draw sprites
- Options include rotation and other transformations
- Efficient rendering with minimal draw calls

### Visual Effects
- **ScreenShake**: Utility for shake effects (collision, impact)
- **ParticleSystem**: For particle effects (feathers, explosions)
- Apply effects via `ctx.save()`/`ctx.restore()` pattern
- Fade effects using `ctx.globalAlpha`

### Leaderboard System
- Frontend calls Cloudflare Worker API instead of Turso directly
- Worker holds Turso credentials securely (environment variables)
- API endpoints:
  - `POST /api/submit` - Submit a score (requires `{ name, score }`)
  - `GET /api/scores?limit=10` - Get top scores
- Environment variable: `VITE_LEADERBOARD_API_URL` points to worker URL
- Worker uses ES module export format: `export default { async fetch(request, env) { ... } }`

## Game Configuration

Configuration is distributed across individual modules for maintainability:
- Each entity and utility class defines its own config constants at module level
- Config values use UPPER_SNAKE_CASE naming convention
- Game-wide settings in `src/Game.js`:
  - Tube gap: 125 pixels
  - Tube speed: 90 pixels/second
  - Tube spacing: 420 pixels
  - Ground speed: matches tubes
  - Bird jump velocity: configured for physics feel

## Best Practices

### When Modifying Game Logic
1. Test on both desktop (keyboard/mouse) and mobile (touch)
2. Ensure delta time scaling for all movements
3. Update collision detection boundaries if modifying entity sizes
4. Check that score tracking updates correctly

### When Adding New Scenes
1. Extend `BaseScene`
2. Register in `Game.js` scenes object
3. Add corresponding state to `GameState.js` if needed
4. Handle proper cleanup in `onExit()`
5. Implement all required methods
6. Consider adding swoosh sound effect on scene transitions for consistency

### When Adding UI Components
1. Place in `src/ui/` directory
2. Use `SpriteRenderer` for visual elements
3. Handle input events with proper coordinate transformation
4. Implement `draw()` and `update()` methods

### When Working with Canvas
1. Always use `ctx.save()` before state changes
2. Always use `ctx.restore()` after state changes
3. Batch draw calls when possible
4. Clear canvas at start of each frame
5. Use sprite atlas for all game assets

### When Using Visual Effects
1. Update ScreenShake in scene's `update()` method
2. Apply shake offset before drawing: `ctx.translate(shake.x, shake.y)`
3. Update and draw ParticleSystem in scene loop
4. Clear particles when scene changes via `onExit()`

### State Management
- Game state transitions via `game.transitionTo(GameState.STATE)`
- Scene handles its own state in `onEnter`/`onExit`
- Entities have `reset()` methods for state restoration
- High scores persisted via localStorage

### Environment Variables
- `.env.example` shows required environment variables
- `.env` is gitignored - never commit secrets
- `VITE_LEADERBOARD_API_URL` - URL to Cloudflare Worker for leaderboard
- Turso credentials are stored in Cloudflare Worker secrets, not in frontend

## Common Gotchas

1. **Canvas scaling**: Coordinates must be transformed from screen to canvas space using `getBoundingClientRect()`
2. **Audio autoplay**: Audio context must resume on first user interaction
3. **Asset loading**: Game waits for atlas to load before starting
4. **Delta time**: Always multiply movement by deltaTime for frame-rate independence
5. **Optional chaining**: Use `?.` for sounds since they may fail to load
6. **Sprite atlas**: All sprites must exist in atlas.json; check the file if sprite doesn't render
7. **Font rendering**: Numbers use sprite font from atlas (`font_048` through `font_057`), not TTF fonts
8. **Screen shake**: Apply offset to entire canvas, restore after drawing all elements
9. **Animation timing**: Use ease functions for smooth UI transitions
10. **Event listener cleanup**: Not required for window event listeners since page reloads on code changes during development
11. **Leaderboard API**: Always call Cloudflare Worker, never Turso directly (security)

## Testing

- Run the game in browser: `npm run dev`
- Test with keyboard (Space/Enter)
- Test with mouse click
- Test with touch (use browser dev tools mobile emulation)
- Check collision at edges and with pipes
- Verify score tracking and high score persistence
- Test audio playback
- Check production build: `npm run build && npm run preview`
- Test screen shake and particle effects
- Verify social meta tags (OpenGraph, Twitter Card)

## File Cleanup

The project uses `.gitignore` to exclude:
- `node_modules/` - npm dependencies
- `dist/` - build output
- `.DS_Store` - macOS system files
- IDE and OS specific files

When removing files:
- Use `git rm` for tracked files
- Run `npm run lint` after deletions to verify no broken imports

## File Modifications Checklist

Before committing changes:
- [ ] Run `npm run lint` and fix all issues
- [ ] Test in development server
- [ ] Test production build
- [ ] Test on desktop
- [ ] Test on mobile/touch
- [ ] Verify no console errors or warnings
- [ ] Check memory leaks (cleanup in onExit)
- [ ] Ensure consistent styling with existing code
