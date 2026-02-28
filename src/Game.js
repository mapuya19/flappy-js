import Bird from './Bird.js';
import Tubes from './Tubes.js';
import Score from './Score.js';
import Background from './utils/Background.js';
import { ParticleSystem } from './utils/ParticleSystem.js';
import ScreenShake from './utils/ScreenShake.js';
import { loadSounds, loadFont } from './utils/audio.js';
import { getHighScore, setHighScore } from './utils/storage.js';

export default class Game {
  constructor(container) {
    this.container = container;
    this.width = 500;
    this.height = 600;
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.maxWidth = '100%';
    this.canvas.style.maxHeight = '100vh';
    this.container.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    
    this.gameState = 'menu';
    this.font = null;
    this.lastTime = 0;
    this.gameStarted = false;
    this.hoverTime = 0;
    this.hoverOffset = 0;
    
    this.bird = null;
    this.tubes = null;
    this.score = null;
    this.background = new Background(this.width, this.height);
    this.particles = new ParticleSystem();
    this.screenShake = new ScreenShake();
    this.sounds = {};
    
    this.highScore = getHighScore();
    this.currentScore = 0;
    
    this.setupInput();
    this.loadAssets();
  }
  
  async loadAssets() {
    const [sounds, font] = await Promise.all([
      loadSounds(),
      loadFont('/assets/flappy-font.ttf')
    ]);
    
    this.sounds = sounds;
    this.font = font;
    this.initGame();
    
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.start();
    }
  }
  
  initGame() {
    this.bird = new Bird(150, this.height / 2);
    this.tubes = new Tubes(this.width);
    this.score = new Score();
    this.currentScore = 0;
    this.hoverTime = 0;
    this.hoverOffset = 0;
  }
  
  setupInput() {
    const handleJump = (e) => {
      e.preventDefault();
      
      if (this.gameState === 'playing') {
        if (this.bird) {
          this.bird.jump();
          this.sounds.wing?.play();
          this.particles.emit(150, this.bird.y, 5, {
            colors: ['#FFE666', '#FFD93D'],
            minVelocity: { x: -50, y: -80 },
            maxVelocity: { x: 50, y: -40 },
            minSize: 2,
            maxSize: 5
          });
        }
      } else if (this.gameState === 'menu') {
        this.startGame();
      } else if (this.gameState === 'ready') {
        this.startPlaying();
      } else if (this.gameState === 'gameover') {
        this.restartGame();
      }
    };
    
    this.canvas.addEventListener('mousedown', handleJump);
    this.canvas.addEventListener('touchstart', handleJump, { passive: false });
    
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleJump(e);
      }
    });
  }
  
  startGame() {
    this.gameState = 'ready';
    this.initGame();
  }
  
  startPlaying() {
    this.gameState = 'playing';
    if (this.bird) {
      this.bird.jump();
      this.sounds.wing?.play();
      this.particles.emit(150, this.bird.y, 5, {
        colors: ['#FFE666', '#FFD93D'],
        minVelocity: { x: -50, y: -80 },
        maxVelocity: { x: 50, y: -40 },
        minSize: 2,
        maxSize: 5
      });
    }
  }
  
  restartGame() {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      setHighScore(this.highScore);
    }
    this.startGame();
  }
  
  gameOver() {
    this.gameState = 'gameover';
    this.sounds.hit?.play();
    this.sounds.die?.play();
    
    this.screenShake.shake(15, 0.4);
    
    this.particles.emit(150, this.bird.y, 20, {
      colors: ['#FFE666', '#FF6B6B', '#FFD93D'],
      minVelocity: { x: -150, y: -200 },
      maxVelocity: { x: 150, y: -50 },
      minSize: 3,
      maxSize: 8
    });
    
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      setHighScore(this.highScore);
    }
  }
  
  update(deltaTime) {
    const speedMultiplier = this.gameState === 'playing' ? 1 : 0.2;
    this.background.update(deltaTime, speedMultiplier);
    this.particles.update(deltaTime);
    this.screenShake.update(deltaTime);
    
    if (!this.bird || !this.tubes) {
      return;
    }
    
    if (this.gameState === 'ready') {
      this.hoverTime += deltaTime;
      this.hoverOffset = Math.sin(this.hoverTime * 3) * 8;
    } else if (this.gameState === 'playing') {
      this.bird.update();
      this.tubes.update(true);
      
      if (this.bird.checkCollision(this.tubes)) {
        this.gameOver();
      }
      
      if (this.tubes.checkScore(this.bird)) {
        this.currentScore++;
        this.sounds.point?.play();
        this.particles.emit(150, 50, 10, {
          colors: ['#4CAF50', '#66BB6A', '#81C784'],
          minVelocity: { x: -80, y: -100 },
          maxVelocity: { x: 80, y: -30 },
          minSize: 3,
          maxSize: 6
        });
      }
    } else if (this.gameState === 'gameover') {
      this.bird.update();
      this.tubes.update(false);
    }
  }
  
  draw() {
    const shake = this.screenShake.update(0);
    
    this.ctx.save();
    this.ctx.translate(shake.x, shake.y);
    
    this.ctx.clearRect(-shake.x, -shake.y, this.width, this.height);
    
    this.background.draw(this.ctx);
    
    if (this.tubes) {
      this.tubes.draw(this.ctx);
    }
    
    if (this.bird) {
      this.bird.draw(this.ctx, this.gameState === 'ready' ? this.hoverOffset : 0);
    }
    
    this.particles.draw(this.ctx);
    
    if (this.score) {
      this.score.draw(this.ctx, this.currentScore, this.font);
    }
    
    if (this.gameState === 'menu') {
      this.drawMenu();
    } else if (this.gameState === 'ready') {
      this.drawReady();
    } else if (this.gameState === 'gameover') {
      this.drawGameOver();
    }
    
    this.ctx.restore();
  }
  
  drawMenu() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const x = this.width / 2;
    const y = this.height / 2;
    
    this.ctx.font = `bold 60px ${this.font || 'Arial'}`;
    this.ctx.textAlign = 'center';
    
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.lineJoin = 'round';
    this.ctx.strokeText('Flappy JS', x, y - 20);
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Flappy JS', x, y - 20);
    
    this.ctx.font = `32px ${this.font || 'Arial'}`;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.strokeText('Tap or press Space to start', x, y + 50);
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Tap or press Space to start', x, y + 50);
  }
  
  drawReady() {
    const x = this.width / 2;
    const y = this.height / 2;
    
    this.ctx.font = `bold 60px ${this.font || 'Arial'}`;
    this.ctx.textAlign = 'center';
    
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.lineJoin = 'round';
    this.ctx.strokeText('Get Ready!', x, y - 20);
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Get Ready!', x, y - 20);
    
    this.ctx.font = `32px ${this.font || 'Arial'}`;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.strokeText('Tap or press Space to start', x, y + 50);
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Tap or press Space to start', x, y + 50);
  }
  
  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const x = this.width / 2;
    const y = this.height / 2;
    
    this.ctx.font = `bold 60px ${this.font || 'Arial'}`;
    this.ctx.textAlign = 'center';
    
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.lineJoin = 'round';
    this.ctx.strokeText('Game Over', x, y - 90);
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Game Over', x, y - 90);
    
    this.ctx.font = `30px ${this.font || 'Arial'}`;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    
    this.ctx.strokeText(`Score: ${this.currentScore}`, x, y - 10);
    this.ctx.strokeText(`Best: ${this.highScore}`, x, y + 30);
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`Score: ${this.currentScore}`, x, y - 10);
    this.ctx.fillText(`Best: ${this.highScore}`, x, y + 30);
    
    this.ctx.font = `28px ${this.font || 'Arial'}`;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.strokeText('Tap or press Space to restart', x, y + 90);
    
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Tap or press Space to restart', x, y + 90);
  }
  
  start() {
    const gameLoop = (timestamp) => {
      const deltaTime = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;
      
      this.update(deltaTime);
      this.draw();
      
      requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
  }
}
