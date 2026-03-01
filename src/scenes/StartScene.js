import { BaseScene } from './BaseScene.js';
import { Button } from '../ui/Button.js';

export class StartScene extends BaseScene {
  constructor(game) {
    super(game);
    this.playButton = null;
    this.rateButton = null;
    this.scoreButton = null;
    this.birdY = 0;
    this.birdTimer = 0;
  }

  onEnter() {
    const midX = this.game.width / 2;
    const buttonY = this.game.height * 0.75;

    this.playButton = new Button(
      this.renderer,
      'button_play',
      midX / 2,
      buttonY,
      () => this.transitionToReady()
    );

    this.rateButton = new Button(
      this.renderer,
      'button_rate',
      midX,
      this.game.height * 0.60,
      () => window.open('https://github.com/mapuya19/flappy-js', '_blank')
    );

    this.scoreButton = new Button(
      this.renderer,
      'button_score',
      midX * 1.5,
      buttonY,
      () => this.transitionToScoreboard()
    );
  }

  transitionToReady() {
    this.game.triggerFadeToReady();
  }

  transitionToScoreboard() {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
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

    const birdColor = this.game.bird ? this.game.bird.birdColor : 0;
    this.renderer.drawSprite(
      `bird${birdColor}_0`,
      this.game.width / 2,
      this.game.height * 0.45 + this.birdY
    );

    this.renderer.drawSprite('title', this.game.width / 2, this.game.height * 0.25);

    if (this.playButton) this.playButton.draw();
    if (this.rateButton) this.rateButton.draw();
    if (this.scoreButton) this.scoreButton.draw();
  }

  handleInput(x, y) {
    if (this.playButton && this.playButton.handleInput(x, y)) return true;
    if (this.rateButton && this.rateButton.handleInput(x, y)) return true;
    if (this.scoreButton && this.scoreButton.handleInput(x, y)) return true;
    return false;
  }

  handleRelease(x, y) {
    if (this.playButton && this.playButton.handleRelease(x, y)) return true;
    if (this.rateButton && this.rateButton.handleRelease(x, y)) return true;
    if (this.scoreButton && this.scoreButton.handleRelease(x, y)) return true;
    return false;
  }
}
