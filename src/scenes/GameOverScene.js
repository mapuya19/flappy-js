import { BaseScene } from './BaseScene.js';
import { Button } from '../ui/Button.js';
import { ScorePanel } from '../ui/ScorePanel.js';
import { GameState } from '../GameState.js';

const GameOverSceneConfig = {
  BUTTONS: {
    yRatio: 0.735,
    spacing: 60
  },
  ANIMATION: {
    gameOverFadeInStart: 0.5,
    gameOverBounceEnd: 0.8,
    gameOverSettleEnd: 1.2,
    panelSlideInStart: 1.0,
    panelSlideInEnd: 1.5,
    buttonsShowBaseTime: 1.6,
    buttonsShowScoreTime: 2.2,
    showTextDelay: 0.2,
    showPanelDelay: 1.0,
    showButtonsDelay: 2.2
  },
  POSITIONS: {
    gameOverYRatio: 0.30,
    panelYRatio: 0.5,
    gameOverBounceOffset: -15,
    panelStartOffset: 150,
    buttonsStartOffset: 80
  }
};

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
    const buttonY = this.game.height * GameOverSceneConfig.BUTTONS.yRatio;

    this.animationTimer = 0;
    this.gameOverY = GameOverSceneConfig.POSITIONS.gameOverBounceOffset;
    this.gameOverAlpha = 0;
    this.panelY = this.game.height + GameOverSceneConfig.POSITIONS.panelStartOffset;
    this.buttonsY = this.game.height + GameOverSceneConfig.POSITIONS.buttonsStartOffset;
    this.buttonTargetY = buttonY;
    this.scoreAnimationStarted = false;
    this.gameOverSoundPlayed = false;
    this.panelSoundPlayed = false;

    this.scorePanel = new ScorePanel(this.renderer, midX, this.game.height * GameOverSceneConfig.POSITIONS.panelYRatio);

    this.playButton = new Button(
      this.renderer,
      'button_play',
      midX - GameOverSceneConfig.BUTTONS.spacing,
      buttonY,
      () => this.restart()
    );

    this.scoreButton = new Button(
      this.renderer,
      'button_score',
      midX + GameOverSceneConfig.BUTTONS.spacing,
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

    const gameOverTarget = this.game.height * GameOverSceneConfig.POSITIONS.gameOverYRatio;
    const panelTarget = this.game.height * GameOverSceneConfig.POSITIONS.panelYRatio;
    const buttonsTarget = this.buttonTargetY;

    if (this.animationTimer < GameOverSceneConfig.ANIMATION.gameOverFadeInStart) {
      this.gameOverY = gameOverTarget;
      this.gameOverAlpha = 0;
    } else if (this.animationTimer < GameOverSceneConfig.ANIMATION.gameOverBounceEnd) {
      if (!this.gameOverSoundPlayed) {
        this.game.sounds.swoosh?.play();
        this.gameOverSoundPlayed = true;
      }
      const t = (this.animationTimer - GameOverSceneConfig.ANIMATION.gameOverFadeInStart) / 
                (GameOverSceneConfig.ANIMATION.gameOverBounceEnd - GameOverSceneConfig.ANIMATION.gameOverFadeInStart);
      this.gameOverAlpha = t;
      const bounceEase = t * (2 - t);
      this.gameOverY = gameOverTarget * (1 - bounceEase) + (gameOverTarget + GameOverSceneConfig.POSITIONS.gameOverBounceOffset) * bounceEase;
    } else if (this.animationTimer < GameOverSceneConfig.ANIMATION.gameOverSettleEnd) {
      if (!this.gameOverSoundPlayed) {
        this.game.sounds.swoosh?.play();
        this.gameOverSoundPlayed = true;
      }
      const t = (this.animationTimer - GameOverSceneConfig.ANIMATION.gameOverBounceEnd) / 
                (GameOverSceneConfig.ANIMATION.gameOverSettleEnd - GameOverSceneConfig.ANIMATION.gameOverBounceEnd);
      const ease = t * (2 - t);
      this.gameOverY = (gameOverTarget + GameOverSceneConfig.POSITIONS.gameOverBounceOffset) * (1 - ease) + gameOverTarget * ease;
      this.gameOverAlpha = 1;
    } else {
      this.gameOverY = gameOverTarget;
      this.gameOverAlpha = 1;
    }

    if (this.animationTimer < GameOverSceneConfig.ANIMATION.panelSlideInStart) {
      this.panelY = this.game.height + GameOverSceneConfig.POSITIONS.panelStartOffset;
    } else if (this.animationTimer < GameOverSceneConfig.ANIMATION.panelSlideInEnd) {
      if (!this.panelSoundPlayed) {
        this.game.sounds.swoosh?.play();
        this.panelSoundPlayed = true;
      }
      const t = (this.animationTimer - GameOverSceneConfig.ANIMATION.panelSlideInStart) / 
                (GameOverSceneConfig.ANIMATION.panelSlideInEnd - GameOverSceneConfig.ANIMATION.panelSlideInStart);
      const ease = t * t * (3 - 2 * t);
      this.panelY = (this.game.height + GameOverSceneConfig.POSITIONS.panelStartOffset) * (1 - ease) + panelTarget * ease;
    } else {
      this.panelY = panelTarget;
    }

    if (this.animationTimer >= GameOverSceneConfig.ANIMATION.buttonsShowBaseTime && !this.scoreAnimationStarted && this.scorePanel.currentScore > 0) {
      this.scorePanel.startScoreAnimation();
      this.scoreAnimationStarted = true;
      this.game.updateHighScoreIfNeeded(this.scorePanel.currentScore);
    }

    const scoreAnimationComplete = this.scorePanel.isScoreAnimationComplete();
    let showButtonsAtTime;

    if (this.scorePanel.currentScore === 0) {
      showButtonsAtTime = GameOverSceneConfig.ANIMATION.buttonsShowBaseTime;
    } else if (scoreAnimationComplete) {
      showButtonsAtTime = GameOverSceneConfig.ANIMATION.buttonsShowScoreTime;
    } else {
      showButtonsAtTime = GameOverSceneConfig.ANIMATION.buttonsShowScoreTime;
    }

    if (this.animationTimer < showButtonsAtTime) {
      this.buttonsY = this.game.height + GameOverSceneConfig.POSITIONS.buttonsStartOffset;
    } else {
      this.buttonsY = buttonsTarget;
    }
  }

  draw(ctx) {
    if (this.game.background) {
      this.game.background.draw(this.renderer);
    }

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

    if (this.animationTimer >= GameOverSceneConfig.ANIMATION.showTextDelay) {
      this.renderer.drawSprite('text_game_over', this.game.width / 2, this.gameOverY, { alpha: this.gameOverAlpha });
    }

    if (this.animationTimer >= GameOverSceneConfig.ANIMATION.showPanelDelay) {
      if (this.scorePanel) {
        this.scorePanel.currentY = this.panelY;
        this.scorePanel.draw(ctx);
      }
    }

    if (this.animationTimer >= GameOverSceneConfig.ANIMATION.showButtonsDelay) {
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
      enableInputAtTime = GameOverSceneConfig.ANIMATION.buttonsShowBaseTime;
    } else if (scoreAnimationComplete) {
      enableInputAtTime = GameOverSceneConfig.ANIMATION.buttonsShowScoreTime;
    } else {
      enableInputAtTime = GameOverSceneConfig.ANIMATION.buttonsShowScoreTime;
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
      enableInputAtTime = GameOverSceneConfig.ANIMATION.buttonsShowBaseTime;
    } else if (scoreAnimationComplete) {
      enableInputAtTime = GameOverSceneConfig.ANIMATION.buttonsShowScoreTime;
    } else {
      enableInputAtTime = GameOverSceneConfig.ANIMATION.buttonsShowScoreTime;
    }

    if (this.animationTimer >= enableInputAtTime) {
      if (this.playButton && this.playButton.handleRelease(x, y)) return true;
      if (this.scoreButton && this.scoreButton.handleRelease(x, y)) return true;
    }
    return false;
  }
}
