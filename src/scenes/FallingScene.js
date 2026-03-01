import { BaseScene } from './BaseScene.js';

export class FallingScene extends BaseScene {
  constructor(game) {
    super(game);
    this.hitGround = false;
    this.groundTimer = 0;
    this.fallSpeed = 0;
    this.flashTimer = 0;
  }

  onEnter() {
    this.fallSpeed = 50;
    this.game.bird.velocity = 50;
    this.flashTimer = 0;
    this.hitGround = false;
    this.groundTimer = 0;
    this.game.sounds.die?.play();
  }

  update(deltaTime) {
    const groundY = this.game.height - this.game.ground.groundHeight;
    const groundSurface = groundY - 12;

    const targetRotation = 90 * Math.PI / 180;
    this.game.bird.rotation += (targetRotation - this.game.bird.rotation) * 0.15;

    if (!this.hitGround) {
      this.fallSpeed += 1500 * deltaTime;
      this.game.bird.y += this.fallSpeed * deltaTime;

      if (this.game.bird.y >= groundSurface) {
        this.game.bird.y = groundSurface + 5;
        this.hitGround = true;
      }
    } else {
      this.groundTimer += deltaTime;
      if (this.groundTimer >= 0.5) {
        this.game.triggerGameOver(false);
      }
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

    this.flashTimer += 0.033;
    if (this.flashTimer < 0.25) {
      const alpha = this.flashTimer / 0.25;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fillRect(0, 0, this.game.width, this.game.height);
    } else if (this.flashTimer < 0.5) {
      const alpha = 1 - (this.flashTimer - 0.25) / 0.25;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fillRect(0, 0, this.game.width, this.game.height);
    }
  }
}
