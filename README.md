# Flappy JS - Modern Edition

A modernized Flappy Bird game built with vanilla JavaScript and Canvas API. Originally created in 2020 with Processing and p5.js, rebuilt in 2026.

![Flappy JS](flappy-js.png)

## Features

- Modern tech stack: ES6+ JavaScript, Vite, Canvas API
- Responsive design for desktop and mobile
- Touch controls, keyboard support, high scores with localStorage
- Visual polish: particle effects, screen shake, parallax backgrounds
- Auto-deployment to GitHub Pages via GitHub Actions

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to play.

## Gameplay

- **Desktop**: Space bar or click to jump
- **Mobile**: Tap to jump
- Navigate through pipe gaps without hitting them or the ground

## Development

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build locally
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── main.js           # Entry point
├── Game.js           # Game controller
├── Bird.js           # Bird entity
├── Tubes.js          # Pipe obstacles
├── Score.js          # Score display
└── utils/
    ├── Background.js       # Parallax background
    ├── ParticleSystem.js   # Visual effects
    ├── ScreenShake.js      # Screen shake
    ├── audio.js            # Sound management
    └── storage.js          # High score persistence

public/
└── assets/               # Static assets (sounds, fonts)
```

## Deployment

The game is automatically deployed to GitHub Pages via GitHub Actions:

- **Live Demo**: [https://matthewapuya.com/flappy-js/](https://matthewapuya.com/flappy-js/)
- **Workflow**: Builds on push to master branch
- **Source**: GitHub Actions (configured in `.github/workflows/deploy.yml`)

To deploy locally:
```bash
npm run build
# Upload contents of dist/ to your hosting provider
```

## Original Version

The original 2020 version was built with Processing and p5.js. View it here: [github.com/mapuya19/flappy](https://github.com/mapuya19/flappy)

## License

MIT
