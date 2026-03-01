import { AtlasLoader } from './utils/AtlasLoader.js';
import { SpriteRenderer } from './utils/SpriteRenderer.js';
import Bird from './Bird.js';
import Tubes from './Tubes.js';
import Ground from './utils/Ground.js';
import Background from './utils/Background.js';
import { loadSounds } from './utils/audio.js';
import { getHighScore, setHighScore } from './utils/storage.js';
import { GameState, WorldSpeed } from './GameState.js';
import { StartScene } from './scenes/StartScene.js';
import { ReadyScene } from './scenes/ReadyScene.js';
import { GameScene } from './scenes/GameScene.js';
import { FallingScene } from './scenes/FallingScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

const GameConfig = {
  canvas: { width: 288, height: 512 },
  responsive: { maxWidth: 932, maxHeight: 1290 },
  bird: {
    x: 90,
    radius: 15,
    gravity: 900,
    tapVelocity: -260,
    colorCount: 3,
    initialYRatio: 0.5
  },
  tubes: {
    width: 52,
    height: 320,
    gap: 125,
    speed: 90,
    spacing: 420,
    spawnInterval: 2.0
  },
  fade: {
    duration: 0.2
  },
  loading: {
    bgColor: '#70c5ce',
    textColor: '#ffffff',
    font: '24px Arial',
    text: 'Loading...'
  },
  gameLoop: {
    maxDeltaTime: 1 / 30
  }
};

export default class Game {
  constructor(container) {
    this.container = container;
    this.width = GameConfig.canvas.width;
    this.height = GameConfig.canvas.height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.container.appendChild(this.canvas);
    this.setupResponsiveScaling();

    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.atlas = new AtlasLoader();
    this.renderer = new SpriteRenderer(this.ctx, this.atlas);
    this.sounds = {};

    this.gameState = GameState.START;
    this.currentScene = null;
    this.lastScore = 0;
    this.currentScore = 0;
    this.firstDeath = true;

    this.bird = new Bird({ ...GameConfig.bird, canvasHeight: this.height });
    this.bird.y = this.height * GameConfig.bird.initialYRatio;

    this.tubes = new Tubes({ ...GameConfig.tubes, canvasHeight: this.height, canvasWidth: this.width });
    this.ground = new Ground(this.width, this.height, WorldSpeed.GROUND);
    this.background = new Background(this.width, this.height, WorldSpeed.GROUND);

    this.highScore = getHighScore();
    this.lastTime = 0;

    this.fading = false;
    this.fadeAlpha = 0;
    this.fadeTimer = 0;
    this.nextState = null;

    this.scenes = {
      [GameState.START]: new StartScene(this),
      [GameState.READY]: new ReadyScene(this),
      [GameState.PLAYING]: new GameScene(this),
      [GameState.FALLING]: new FallingScene(this),
      [GameState.GAME_OVER]: new GameOverScene(this)
    };

    this.setupInput();
    this.loadAssets();
    this.start();
  }

  setupResponsiveScaling() {
    const updateScale = () => {
      const scaleWidth = Math.min(window.innerWidth, GameConfig.responsive.maxWidth) / this.width;
      const scaleHeight = Math.min(window.innerHeight, GameConfig.responsive.maxHeight) / this.height;
      const scale = Math.min(scaleWidth, scaleHeight);

      this.canvas.style.width = `${this.width * scale}px`;
      this.canvas.style.height = `${this.height * scale}px`;
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
  }

  async loadAssets() {
    await this.atlas.load();

    this.ground.setAtlas(this.atlas.atlasImage);
    this.ground.setContext(this.ctx);
    this.tubes.setAtlas(this.atlas.atlasImage);

    this.sounds = await loadSounds();
    this.transitionTo(GameState.START);
  }

  transitionTo(newState) {
    if (this.currentScene) {
      this.currentScene.onExit();
    }

    this.gameState = newState;
    this.currentScene = this.scenes[newState];

    if (this.currentScene) {
      if (newState === GameState.READY) {
        if (!this.firstDeath) {
          this.bird.birdColor = Math.floor(Math.random() * GameConfig.bird.colorCount);
          this.background.setDayMode(Math.random() < 0.5);
        }
        this.bird.reset();
        this.tubes.reset();
        this.currentScore = 0;
      }
      if (newState === GameState.FALLING) {
        this.bird.velocity = 0;
      }
      this.currentScene.onEnter(this.currentScore, this.highScore);
    }
  }

  triggerFadeToReady() {
    if (this.fading === true) return;
    this.fadeAlpha = 0;
    this.fadeTimer = 0;
    this.fading = true;
    this.nextState = GameState.READY;
  }

  transitionToFalling() {
    this.bird.velocity = 0;
    this.sounds.hit?.play();
    this.transitionTo(GameState.FALLING);
  }

  triggerGameOver(playSound = true) {
    this.firstDeath = false;

    if (playSound) {
      this.sounds.hit?.play();
      this.sounds.die?.play();
    }

    this.lastScore = this.currentScore;
    this.transitionTo(GameState.GAME_OVER);
  }

  updateHighScoreIfNeeded(score) {
    if (score > this.highScore) {
      this.highScore = score;
      setHighScore(this.highScore);
    }
  }

  setupInput() {
    const getCanvasCoords = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const handleStart = (e) => {
      e.preventDefault();
      const coords = getCanvasCoords(e);
      if (this.currentScene) {
        this.currentScene.handleInput(coords.x, coords.y);
      }
    };

    const handleEnd = (e) => {
      e.preventDefault();
      const coords = getCanvasCoords(e);
      if (this.currentScene) {
        this.currentScene.handleRelease(coords.x, coords.y);
      }
    };

    this.canvas.addEventListener('mousedown', handleStart);
    this.canvas.addEventListener('mouseup', handleEnd);
    this.canvas.addEventListener('touchstart', handleStart, { passive: false });
    this.canvas.addEventListener('touchend', handleEnd, { passive: false });
    this.canvas.addEventListener('touchmove', handleStart, { passive: false });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleStart(e);
      }
    });

    document.body.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  update(deltaTime) {
    if (!this.atlas.loaded) return;

    if (this.fading === true) {
      this.fadeTimer += deltaTime;
      if (this.fadeTimer < GameConfig.fade.duration) {
        this.fadeAlpha = this.fadeTimer / GameConfig.fade.duration;
      } else if (this.fadeTimer >= GameConfig.fade.duration) {
        this.transitionTo(this.nextState);
        this.fading = 'out';
        this.fadeTimer = 0;
      }
      return;
    }

    if (this.fading === 'out') {
      this.fadeTimer += deltaTime;
      this.fadeAlpha = 1 - Math.min(this.fadeTimer / GameConfig.fade.duration, 1);
      if (this.fadeTimer >= GameConfig.fade.duration) {
        this.fading = false;
      }
    }

    const shouldMove = this.gameState === GameState.START || this.gameState === GameState.READY || this.gameState === GameState.PLAYING;
    const speedMultiplier = shouldMove ? 1 : 0;
    this.ground.update(deltaTime, speedMultiplier);

    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (!this.atlas.loaded) {
      this.drawLoading();
      return;
    }

    if (this.currentScene) {
      this.currentScene.draw(this.ctx);
    }

    if (this.fading === true || this.fading === 'out') {
      this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeAlpha})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  drawLoading() {
    this.ctx.fillStyle = GameConfig.loading.bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = GameConfig.loading.textColor;
    this.ctx.font = GameConfig.loading.font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(GameConfig.loading.text, this.width / 2, this.height / 2);
  }

  start() {
    this.lastTime = performance.now();

    const gameLoop = (timestamp) => {
      const deltaTime = Math.min((timestamp - this.lastTime) / 1000, GameConfig.gameLoop.maxDeltaTime);
      this.lastTime = timestamp;

      this.update(deltaTime);
      this.draw();

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }
}
