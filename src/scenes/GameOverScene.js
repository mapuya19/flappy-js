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
    this.gameOverAlpha = 0;
    this.panelY = 0;
    this.buttonsY = 0;
    this.buttonTargetY = 0;
    this.scoreAnimationStarted = false;
    this.gameOverSoundPlayed = false;
    this.panelSoundPlayed = false;
  }

  onEnter(currentScore, bestScore) {
    const midX = this.game.width / 2;
    const buttonY = this.game.height * 0.735;

    this.animationTimer = 0;
    this.gameOverY = -30;
    this.gameOverAlpha = 0;
    this.panelY = this.game.height + 150;
    this.buttonsY = this.game.height + 80;
    this.buttonTargetY = buttonY;
    this.scoreAnimationStarted = false;

    this.scorePanel = new ScorePanel(this.renderer, midX, this.game.height / 2);

    this.playButton = new Button(
      this.renderer,
      'button_play',
      midX - 60,
      buttonY,
      () => this.restart()
    );

    this.scoreButton = new Button(
      this.renderer,
      'button_score',
      midX + 60,
      buttonY,
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
    this.game.sounds.swoosh?.play();
    this.game.transitionTo(GameState.READY);
  }

  update(deltaTime) {
    this.animationTimer += deltaTime;
    if (this.scorePanel) {
      this.scorePanel.update(deltaTime);
    }

    const gameOverTarget = this.game.height * 0.30;
    const panelTarget = this.game.height / 2;
    const buttonsTarget = this.buttonTargetY;

    if (this.animationTimer < 0.5) {
      this.gameOverY = gameOverTarget;
      this.gameOverAlpha = 0;
    } else if (this.animationTimer < 0.8) {
      if (!this.gameOverSoundPlayed) {
        this.game.sounds.swoosh?.play();
        this.gameOverSoundPlayed = true;
      }
      const t = (this.animationTimer - 0.5) / 0.3;
      this.gameOverAlpha = t;
      const bounceT = (this.animationTimer - 0.5) / 0.3;
      const bounceEase = bounceT * (2 - bounceT);
      this.gameOverY = gameOverTarget * (1 - bounceEase) + (gameOverTarget - 15) * bounceEase;
    } else if (this.animationTimer < 1.2) {
      if (!this.gameOverSoundPlayed) {
        this.game.sounds.swoosh?.play();
        this.gameOverSoundPlayed = true;
      }
      const t = (this.animationTimer - 0.8) / 0.4;
      const ease = t * (2 - t);
      this.gameOverY = (gameOverTarget - 15) * (1 - ease) + gameOverTarget * ease;
      this.gameOverAlpha = 1;
    } else {
      this.gameOverY = gameOverTarget;
      this.gameOverAlpha = 1;
    }

    if (this.animationTimer < 1.0) {
      this.panelY = this.game.height + 150;
    } else if (this.animationTimer < 1.5) {
      if (!this.panelSoundPlayed) {
        this.game.sounds.swoosh?.play();
        this.panelSoundPlayed = true;
      }
      const t = (this.animationTimer - 1.0) / 0.5;
      const ease = t * t * (3 - 2 * t);
      this.panelY = (this.game.height + 150) * (1 - ease) + panelTarget * ease;
    } else {
      this.panelY = panelTarget;
    }

    if (this.animationTimer >= 1.6 && !this.scoreAnimationStarted && this.scorePanel.currentScore > 0) {
      this.scorePanel.startScoreAnimation();
      this.scoreAnimationStarted = true;
      this.game.updateHighScoreIfNeeded(this.scorePanel.currentScore);
    }

    const scoreAnimationComplete = this.scorePanel.isScoreAnimationComplete();
    let showButtonsAtTime;

    if (this.scorePanel.currentScore === 0) {
      showButtonsAtTime = 1.6;
    } else if (scoreAnimationComplete) {
      showButtonsAtTime = 2.2;
    } else {
      showButtonsAtTime = 2.2;
    }

    if (this.animationTimer < showButtonsAtTime) {
      this.buttonsY = this.game.height + 80;
    } else {
      this.buttonsY = buttonsTarget;
    }
  }

  draw(ctx) {
    this.renderer.drawSprite('bg_day', this.game.width / 2, this.game.height / 2);

    if (this.game.tubes) {
      this.game.tubes.draw(this.ctx);
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

    if (this.game.ground) {
      this.game.ground.draw();
    }

    if (this.animationTimer >= 0.2) {
      this.renderer.drawSprite('text_game_over', this.game.width / 2, this.gameOverY, { alpha: this.gameOverAlpha });
    }

    if (this.animationTimer >= 1.0) {
      if (this.scorePanel) {
        this.scorePanel.currentY = this.panelY;
        this.scorePanel.draw(ctx);
      }
    }

    if (this.animationTimer >= 2.2) {
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
    const scoreAnimationComplete = this.scorePanel.isScoreAnimationComplete();
    let enableInputAtTime;

    if (this.scorePanel.currentScore === 0) {
      enableInputAtTime = 1.6;
    } else if (scoreAnimationComplete) {
      enableInputAtTime = 2.2;
    } else {
      enableInputAtTime = 2.2;
    }

    if (this.animationTimer >= enableInputAtTime) {
      if (this.playButton && this.playButton.handleInput(x, y)) return true;
      if (this.scoreButton && this.scoreButton.handleInput(x, y)) return true;
    }
    return false;
  }

  handleRelease(x, y) {
    const scoreAnimationComplete = this.scorePanel.isScoreAnimationComplete();
    let enableInputAtTime;

    if (this.scorePanel.currentScore === 0) {
      enableInputAtTime = 1.6;
    } else if (scoreAnimationComplete) {
      enableInputAtTime = 2.2;
    } else {
      enableInputAtTime = 2.2;
    }

    if (this.animationTimer >= enableInputAtTime) {
      if (this.playButton && this.playButton.handleRelease(x, y)) return true;
      if (this.scoreButton && this.scoreButton.handleRelease(x, y)) return true;
    }
    return false;
  }
}
