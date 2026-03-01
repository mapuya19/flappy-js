import { BaseScene } from './BaseScene.js';

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
    if (this.game.bird.y >= groundY - 12) {
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
    this.renderer.drawSprite('bg_day', this.game.width / 2, this.game.height / 2);

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
    const digitWidth = 20;
    const totalWidth = scoreStr.length * digitWidth;
    let currentX = this.game.width / 2 - totalWidth / 2;
    const y = this.game.height * 0.15 + 10;

    for (const digit of scoreStr) {
      const spriteName = `font_0${48 + parseInt(digit)}`;
      this.renderer.drawSprite(spriteName, currentX, y);
      currentX += digitWidth;
    }
  }

  handleInput(_x, _y) {
    this.game.bird.jump();
    this.game.sounds.wing?.play();
    return true;
  }
}
