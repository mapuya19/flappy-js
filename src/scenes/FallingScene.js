import { BaseScene } from './BaseScene.js';
import ScreenShake from '../utils/ScreenShake.js';

const FallingSceneConfig = {
  SCREEN_SHAKE: {
    intensity: 8,
    duration: 0.4
  },
  FALL: {
    initialSpeed: 50,
    gravity: 1500,
    groundOffset: 12,
    landOffset: 3,
    groundTimerThreshold: 0.5
  },
  ROTATION: {
    targetAngle: 90,
    smoothingFactor: 0.15
  },
  FLASH: {
    interval: 0.033,
    fadeInDuration: 0.25,
    fadeOutDuration: 0.5
  }
};

export class FallingScene extends BaseScene {
  constructor(game) {
    super(game);
    this.hitGround = false;
    this.groundTimer = 0;
    this.fallSpeed = 0;
    this.flashTimer = 0;
    this.screenShake = new ScreenShake(FallingSceneConfig.SCREEN_SHAKE.intensity, FallingSceneConfig.SCREEN_SHAKE.duration);
  }

  onEnter() {
    this.fallSpeed = FallingSceneConfig.FALL.initialSpeed;
    this.game.bird.velocity = FallingSceneConfig.FALL.initialSpeed;
    this.flashTimer = 0;
    this.hitGround = false;
    this.groundTimer = 0;
    this.game.sounds.die?.play();
    this.screenShake.shake(FallingSceneConfig.SCREEN_SHAKE.intensity, FallingSceneConfig.SCREEN_SHAKE.duration);
  }

  update(deltaTime) {
    const groundY = this.game.height - this.game.ground.groundHeight;
    const groundSurface = groundY - FallingSceneConfig.FALL.groundOffset;

    this.screenShake.update(deltaTime);

    const targetRotation = FallingSceneConfig.ROTATION.targetAngle * Math.PI / 180;
    this.game.bird.rotation += (targetRotation - this.game.bird.rotation) * FallingSceneConfig.ROTATION.smoothingFactor;

    if (!this.hitGround) {
      this.fallSpeed += FallingSceneConfig.FALL.gravity * deltaTime;
      this.game.bird.y += this.fallSpeed * deltaTime;

      if (this.game.bird.y >= groundSurface) {
        this.game.bird.y = groundSurface + FallingSceneConfig.FALL.landOffset;
        this.hitGround = true;
      }
    } else {
      this.groundTimer += deltaTime;
      if (this.groundTimer >= FallingSceneConfig.FALL.groundTimerThreshold) {
        this.game.triggerGameOver(false);
      }
    }
  }

  draw(_ctx) {
    const shake = this.screenShake.getShake();
    this.ctx.save();
    this.ctx.translate(shake.x, shake.y);

    if (this.game.background) {
      this.game.background.draw(this.renderer);
    }

    if (this.game.tubes) {
      this.game.tubes.draw(this.ctx);
    }

    const birdSprite = this.game.bird.getSpriteName();
    this.renderer.drawSprite(
      birdSprite,
      this.game.bird.x,
      this.game.bird.y,
      { rotation: this.game.bird.rotation }
    );

    if (this.game.ground) {
      this.game.ground.draw();
    }

    this.ctx.restore();

    this.flashTimer += FallingSceneConfig.FLASH.interval;
    if (this.flashTimer < FallingSceneConfig.FLASH.fadeInDuration) {
      const alpha = this.flashTimer / FallingSceneConfig.FLASH.fadeInDuration;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fillRect(0, 0, this.game.width, this.game.height);
    } else if (this.flashTimer < FallingSceneConfig.FLASH.fadeOutDuration) {
      const alpha = 1 - (this.flashTimer - FallingSceneConfig.FLASH.fadeInDuration) / FallingSceneConfig.FLASH.fadeInDuration;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fillRect(0, 0, this.game.width, this.game.height);
    }
  }
}
