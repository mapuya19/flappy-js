import { BaseScene } from './BaseScene.js';

const GameSceneConfig = {
  SCORE: {
    positionYRatio: 0.15,
    offset: 10
  },
  COLLISION: {
    groundOffset: 12
  }
};

export class GameScene extends BaseScene {
  constructor(game) {
    super(game);
    this.score = 0;
    this.collided = false;
  }

  onEnter() {
    this.game.bird.reset();
    this.game.bird.jump();
    this.game.sounds.wing?.play();
    this.score = 0;
    this.collided = false;
  }

  onExit() {
    this.game.currentScore = this.score;
  }

  update(deltaTime) {
    if (this.collided) return;

    this.game.bird.update(deltaTime);
    const scored = this.game.tubes.update(deltaTime, this.game.bird.x);

    const hitPipe = this.game.tubes.checkCollision(this.game.bird);
    if (hitPipe) {
      this.collided = true;
      this.game.transitionToFalling();
      return;
    }

    const groundY = this.game.height - this.game.ground.groundHeight;
    if (this.game.bird.y >= groundY - GameSceneConfig.COLLISION.groundOffset) {
      this.collided = true;
      this.game.triggerGameOver();
      return;
    }

    if (scored) {
      this.score++;
      this.game.sounds.point?.play();
    }
  }

  draw(_ctx) {
    if (this.game.background) {
      this.game.background.draw(this.renderer);
    }

    if (this.game.tubes) {
      this.game.tubes.draw(this.ctx);
    }

    if (this.game.ground) {
      this.game.ground.draw();
    }

    const birdSprite = this.game.bird.getSpriteName();
    this.renderer.drawSprite(
      birdSprite,
      this.game.bird.x,
      this.game.bird.y,
      { rotation: this.game.bird.rotation }
    );

    this.drawScore();
  }

  drawScore() {
    const scoreStr = this.score.toString();
    const y = this.game.height * GameSceneConfig.SCORE.positionYRatio + GameSceneConfig.SCORE.offset;

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
    this.game.bird.jump();
    this.game.sounds.wing?.play();
    return true;
  }
}
