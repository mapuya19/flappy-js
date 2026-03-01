import { BaseScene } from './BaseScene.js';
import { Button } from '../ui/Button.js';
import { ScorePanel } from '../ui/ScorePanel.js';
import { GameState } from '../GameState.js';

export class GameOverScene extends BaseScene {
  constructor(game) {
    super(game);
    this.playButton = null;
    this.scoreButton = null;
    this.scorePanel = null;
    this.animationTimer = 0;
    this.gameOverY = 0;
    this.panelY = 0;
    this.buttonsY = 0;
  }

  onEnter(currentScore, bestScore) {
    const midX = this.game.width / 2;

    this.animationTimer = 0;
    this.gameOverY = -30;
    this.panelY = this.game.height + 150;
    this.buttonsY = this.game.height + 80;

    this.scorePanel = new ScorePanel(this.renderer, midX, this.game.height / 2);

    this.playButton = new Button(
      this.renderer,
      'button_play',
      midX - 60,
      400,
      () => this.restart()
    );

    this.scoreButton = new Button(
      this.renderer,
      'button_score',
      midX + 60,
      400,
      () => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
    );

    this.scorePanel.show(currentScore, bestScore);
  }

  onExit() {
    if (this.scorePanel) {
      this.scorePanel.hide();
    }
  }

  restart() {
    this.game.transitionTo(GameState.READY);
  }

  update(deltaTime) {
    this.animationTimer += deltaTime;
    if (this.scorePanel) {
      this.scorePanel.update(deltaTime);
    }

    const gameOverTarget = this.game.height * 0.25;
    const panelTarget = this.game.height / 2;
    const buttonsTarget = 400;

    if (this.animationTimer < 0.5) {
      this.gameOverY = this.gameOverY; // eslint-disable-line no-self-assign
    } else if (this.animationTimer < 1.0) {
      const t = (this.animationTimer - 0.5) / 0.5;
      const ease = t * (2 - t);
      this.gameOverY = (-30) * (1 - ease) + gameOverTarget * ease;
    } else {
      this.gameOverY = gameOverTarget;
    }

    if (this.animationTimer < 1.0) {
      this.panelY = this.game.height + 150;
    } else if (this.animationTimer < 1.6) {
      const t = (this.animationTimer - 1.0) / 0.6;
      const ease = t * (2 - t);
      this.panelY = (this.game.height + 150) * (1 - ease) + panelTarget * ease;
    } else {
      this.panelY = panelTarget;
    }

    if (this.animationTimer < 1.6) {
      this.buttonsY = this.game.height + 80;
    } else if (this.animationTimer < 2.1) {
      const t = (this.animationTimer - 1.6) / 0.5;
      const ease = t * (2 - t);
      this.buttonsY = (this.game.height + 80) * (1 - ease) + buttonsTarget * ease;
    } else {
      this.buttonsY = buttonsTarget;
    }
  }

  draw(ctx) {
    this.renderer.drawSprite('bg_day', this.game.width / 2, this.game.height / 2);

    if (this.game.tubes) {
      this.game.tubes.draw(this.ctx);
    }

    if (this.game.ground) {
      this.game.ground.draw();
    }

    if (this.game.bird) {
      const birdSprite = this.game.bird.getSpriteName();
      this.renderer.drawSprite(
        birdSprite,
        this.game.bird.x,
        this.game.bird.y,
        { rotation: this.game.bird.rotation }
      );
    }

    if (this.animationTimer >= 0.2) {
      this.renderer.drawSprite('text_game_over', this.game.width / 2, this.gameOverY);
    }

    if (this.animationTimer >= 1.0) {
      if (this.scorePanel) {
        this.scorePanel.currentY = this.panelY;
        this.scorePanel.draw(ctx);
      }
    }

    if (this.animationTimer >= 1.6) {
      if (this.playButton) {
        this.playButton.y = this.buttonsY;
        this.playButton.draw();
      }
      if (this.scoreButton) {
        this.scoreButton.y = this.buttonsY;
        this.scoreButton.draw();
      }
    }
  }

  handleInput(x, y) {
    if (this.animationTimer >= 2.5) {
      if (this.playButton && this.playButton.handleInput(x, y)) return true;
      if (this.scoreButton && this.scoreButton.handleInput(x, y)) return true;
    }
    return false;
  }

  handleRelease(x, y) {
    if (this.animationTimer >= 2.5) {
      if (this.playButton && this.playButton.handleRelease(x, y)) return true;
      if (this.scoreButton && this.scoreButton.handleRelease(x, y)) return true;
    }
    return false;
  }
}
