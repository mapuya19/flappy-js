import { BaseScene } from './BaseScene.js';
import { GameState } from '../GameState.js';

export class ReadyScene extends BaseScene {
  constructor(game) {
    super(game);
    this.birdY = 0;
    this.birdTimer = 0;
    this.fadeAlpha = 0;
    this.fadeTimer = 0;
    this.fading = false;
    this.nextState = null;
  }

  onEnter() {
    this.game.bird.y = this.game.height / 2 + 10;
    this.fadeAlpha = 0;
    this.fadeTimer = 0;
    this.fading = true;
    this.nextState = null;
  }

  update(deltaTime) {
    this.birdTimer += deltaTime;
    this.birdY = Math.sin(this.birdTimer * 7) * 4;
    this.game.bird.updateAnimation(deltaTime);

    if (this.fading) {
      this.fadeTimer += deltaTime;
      if (this.nextState === null) {
        if (this.fadeTimer < 0.5) {
          this.fadeAlpha = this.fadeTimer / 0.5;
        } else {
          this.fadeAlpha = 1;
          this.fading = false;
        }
      } else {
        if (this.fadeTimer < 0.3) {
          this.fadeAlpha = 1 - this.fadeTimer / 0.3;
        } else {
          this.game.transitionTo(this.nextState);
          this.fading = false;
        }
      }
    }
  }

  draw(_ctx) {
    this.renderer.drawSprite('bg_day', this.game.width / 2, this.game.height / 2);

    if (this.game.ground) {
      this.game.ground.draw();
    }

    this.renderer.drawSprite(
      'text_ready',
      this.game.width / 2,
      this.game.height * 0.33,
      { alpha: this.fadeAlpha }
    );

    this.renderer.drawSprite(
      'tutorial',
      this.game.width / 2,
      this.game.height * 0.55,
      { alpha: this.fadeAlpha }
    );

    this.drawScore();

    const birdSprite = this.game.bird.getSpriteName();
    this.renderer.drawSprite(
      birdSprite,
      this.game.bird.x,
      this.game.bird.y + this.birdY
    );
  }

  drawScore() {
    const scoreStr = '0';
    const y = this.game.height * 0.15 + 10;

    const digitWidths = [];
    for (const digit of scoreStr) {
      const spriteName = `font_0${48 + parseInt(digit)}`;
      const size = this.renderer.getSpriteSize(spriteName);
      digitWidths.push(size.width);
    }

    const totalWidth = digitWidths.reduce((sum, width) => sum + width, 0);
    let currentX = this.game.width / 2 - totalWidth / 2 + digitWidths[0] / 2;

    for (let i = 0; i < scoreStr.length; i++) {
      const digit = scoreStr[i];
      const spriteName = `font_0${48 + parseInt(digit)}`;
      this.renderer.drawSprite(spriteName, currentX, y);
      const nextWidth = digitWidths[i + 1] || 0;
      currentX += digitWidths[i] / 2 + nextWidth / 2;
    }
  }

  handleInput(_x, _y) {
    if (this.fading && this.nextState === null) {
      this.fadeTimer = 0;
      this.nextState = GameState.PLAYING;
    } else if (!this.fading) {
      this.fadeTimer = 0;
      this.fading = true;
      this.nextState = GameState.PLAYING;
    }
    return true;
  }
}
