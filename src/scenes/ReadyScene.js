import { BaseScene } from './BaseScene.js';
import { GameState } from '../GameState.js';

export class ReadyScene extends BaseScene {
  constructor(game) {
    super(game);
    this.birdY = 0;
    this.birdTimer = 0;
  }

  onEnter() {
    this.game.bird.y = this.game.height / 2 + 10;
  }

  update(deltaTime) {
    this.birdTimer += deltaTime;
    this.birdY = Math.sin(this.birdTimer * 3) * 8;
  }

  draw(_ctx) {
    this.renderer.drawSprite('bg_day', this.game.width / 2, this.game.height / 2);

    if (this.game.ground) {
      this.game.ground.draw();
    }

    this.renderer.drawSprite(
      'text_ready',
      this.game.width / 2,
      this.game.height * 0.25
    );

    this.renderer.drawSprite(
      'tutorial',
      this.game.width / 2,
      this.game.height * 0.55
    );

    const birdSprite = this.game.bird.getSpriteName();
    this.renderer.drawSprite(
      birdSprite,
      this.game.bird.x,
      this.game.bird.y + this.birdY
    );
  }

  handleInput(_x, _y) {
    this.game.transitionTo(GameState.PLAYING);
    return true;
  }
}
