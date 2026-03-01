import { BaseScene } from './BaseScene.js';
import { GameState } from '../GameState.js';

const ReadySceneConfig = {
  BIRD: {
    yPosOffset: 10,
    hoverFrequency: 7,
    hoverAmplitude: 4
  },
  TEXT: {
    readyYPosRatio: 0.33,
    tutorialYPosRatio: 0.55
  },
  SCORE: {
    yPosRatio: 0.15,
    offset: 10
  },
  FADE: {
    inDuration: 0.5,
    outDuration: 0.3
  }
};

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
    this.game.bird.y = this.game.height / 2 + ReadySceneConfig.BIRD.yPosOffset;
    this.fadeAlpha = 0;
    this.fadeTimer = 0;
    this.fading = true;
    this.nextState = null;
  }

  update(deltaTime) {
    this.birdTimer += deltaTime;
    this.birdY = Math.sin(this.birdTimer * ReadySceneConfig.BIRD.hoverFrequency) * ReadySceneConfig.BIRD.hoverAmplitude;
    this.game.bird.updateAnimation(deltaTime);

    if (this.fading) {
      this.fadeTimer += deltaTime;
      if (this.nextState === null) {
        if (this.fadeTimer < ReadySceneConfig.FADE.inDuration) {
          this.fadeAlpha = this.fadeTimer / ReadySceneConfig.FADE.inDuration;
        } else {
          this.fadeAlpha = 1;
          this.fading = false;
        }
      } else {
        if (this.fadeTimer < ReadySceneConfig.FADE.outDuration) {
          this.fadeAlpha = 1 - this.fadeTimer / ReadySceneConfig.FADE.outDuration;
        } else {
          this.game.transitionTo(this.nextState);
          this.fading = false;
        }
      }
    }
  }

  draw(_ctx) {
    if (this.game.background) {
      this.game.background.draw(this.renderer);
    }

    if (this.game.ground) {
      this.game.ground.draw();
    }

    this.renderer.drawSprite(
      'text_ready',
      this.game.width / 2,
      this.game.height * ReadySceneConfig.TEXT.readyYPosRatio,
      { alpha: this.fadeAlpha }
    );

    this.renderer.drawSprite(
      'tutorial',
      this.game.width / 2,
      this.game.height * ReadySceneConfig.TEXT.tutorialYPosRatio,
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
    const y = this.game.height * ReadySceneConfig.SCORE.yPosRatio + ReadySceneConfig.SCORE.offset;

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
