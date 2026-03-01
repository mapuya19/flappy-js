import { BaseScene } from './BaseScene.js';
import { Button } from '../ui/Button.js';
import { GameState } from '../GameState.js';
import { getTopScores } from '../utils/leaderboard.js';

const LeaderboardSceneConfig = {
  ANIMATION: {
    fadeInDuration: 0.3
  },
  POSITIONS: {
    startYRatio: 0.20,
    rowHeight: 28,
    contentWidth: 170,
    buttonYRatio: 0.73
  }
};

export class LeaderboardScene extends BaseScene {
  constructor(game) {
    super(game);
    this.backButton = null;
    this.scores = [];
    this.animationTimer = 0;
    this.alpha = 0;
    this.loading = true;
  }

  async onEnter() {
    const midX = this.game.width / 2;
    const buttonY = this.game.height * LeaderboardSceneConfig.POSITIONS.buttonYRatio;

    this.animationTimer = 0;
    this.alpha = 0;
    this.loading = true;

    this.backButton = new Button(
      this.renderer,
      'button_menu',
      midX,
      buttonY,
      () => this.goToStart()
    );

    try {
      this.scores = await getTopScores(10);
      this.loading = false;
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      this.loading = false;
    }
  }

  onExit() {}

  goToStart() {
    this.game.sounds.swoosh?.play();
    this.game.transitionTo(GameState.START);
  }

  update(deltaTime) {
    this.animationTimer += deltaTime;

    if (this.animationTimer < LeaderboardSceneConfig.ANIMATION.fadeInDuration) {
      this.alpha = this.animationTimer / LeaderboardSceneConfig.ANIMATION.fadeInDuration;
    } else {
      this.alpha = 1;
    }
  }

  draw(ctx) {
    if (this.game.background) {
      this.game.background.draw(this.renderer);
    }

    if (this.game.ground) {
      this.game.ground.draw();
    }

    ctx.save();
    ctx.globalAlpha = this.alpha;

    const startY = this.game.height * LeaderboardSceneConfig.POSITIONS.startYRatio;
    const rowHeight = LeaderboardSceneConfig.POSITIONS.rowHeight;
    const midX = this.game.width / 2;
    const halfContentWidth = LeaderboardSceneConfig.POSITIONS.contentWidth / 2;
    const nameX = midX - halfContentWidth;
    const scoreX = midX + halfContentWidth;

    if (this.loading) {
      this.drawText(ctx, 'Loading...', midX, startY + 50);
    } else if (this.scores.length === 0) {
      this.drawText(ctx, 'No scores yet', midX, startY + 50);
    } else {
      for (let i = 0; i < this.scores.length; i++) {
        const score = this.scores[i];
        const y = startY + i * rowHeight;

        const name = score.name.length > 10 ? score.name.substring(0, 10) : score.name;
        this.drawText(ctx, `${i + 1}. ${name}`, nameX, y, 'left', 24);
        this.drawScore(score.score, scoreX, y);
      }
    }

    if (this.backButton) {
      this.backButton.draw();
    }

    ctx.restore();
  }

  drawText(ctx, text, x, y, align = 'center', fontSize = 20) {
    ctx.font = `${fontSize}px Flappy`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = '#fff';
    ctx.fillText(text, x, y);
  }

  drawScore(score, x, y) {
    const scoreStr = score.toString();
    const digitWidth = 15;
    const totalWidth = scoreStr.length * digitWidth;
    let currentX = x - totalWidth;

    for (const digit of scoreStr) {
      const spriteName = `number_score_0${digit}`;
      this.renderer.drawSprite(spriteName, currentX, y);
      currentX += digitWidth;
    }
  }

  handleInput(x, y) {
    if (this.backButton && this.backButton.handleInput(x, y)) return true;
    return false;
  }

  handleRelease(x, y) {
    if (this.backButton && this.backButton.handleRelease(x, y)) return true;
    return false;
  }
}
