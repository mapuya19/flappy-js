# Agent Guidelines for Flappy JS

## Overview

This is a modern Flappy Bird clone built with vanilla JavaScript, Canvas API, and Vite. The game uses a scene-based architecture with ES6 modules and follows specific patterns.

## Tech Stack

- **Runtime**: Vanilla JavaScript (ES6+) with ES Modules
- **Build Tool**: Vite
- **Rendering**: HTML5 Canvas API
- **Audio**: Web Audio API
- **Linting**: ESLint

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
- `src/ui/` - UI components (Button, ScorePanel)
- `src/utils/` - Utilities (audio, background, ground, storage, etc.)

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
- Reset methods named `reset()` for entity state restoration

### Naming
- Class names: PascalCase
- Methods: camelCase
- Constants: UPPER_SNAKE_CASE (e.g., GameState.START, WorldSpeed.GROUND)
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

### Sprite Rendering
- All game sprites drawn from a single sprite atlas
- Use `SpriteRenderer.drawSprite(name, x, y, options)` to draw sprites
- Options include rotation and other transformations
- Efficient rendering with minimal draw calls

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

### State Management
- Game state transitions via `game.transitionTo(GameState.STATE)`
- Scene handles its own state in `onEnter`/`onExit`
- Entities have `reset()` methods for state restoration
- High scores persisted via localStorage

## Common Gotchas

1. **Canvas scaling**: Coordinates must be transformed from screen to canvas space using `getBoundingClientRect()`
2. **Audio autoplay**: Audio context must resume on first user interaction
3. **Asset loading**: Game waits for atlas to load before starting
4. **Delta time**: Always multiply movement by deltaTime for frame-rate independence
5. **Optional chaining**: Use `?.` for sounds since they may fail to load
6. **Sprite atlas**: All sprites must exist in atlas.json; check the file if sprite doesn't render

## Testing

- Run the game in browser: `npm run dev`
- Test with keyboard (Space/Enter)
- Test with mouse click
- Test with touch (use browser dev tools mobile emulation)
- Check collision at edges and with pipes
- Verify score tracking and high score persistence
- Test audio playback
- Check production build: `npm run build && npm run preview`

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
