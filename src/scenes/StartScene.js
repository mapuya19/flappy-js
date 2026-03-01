import { BaseScene } from './BaseScene.js';
import { Button } from '../ui/Button.js';
import { GameState } from '../GameState.js';

const StartSceneConfig = {
  BIRD: {
    yPosRatio: 0.45,
    hoverFrequency: 7,
    hoverAmplitude: 4
  },
  TITLE: {
    yPosRatio: 0.33
  },
  BUTTONS: {
    yPosRatio: 0.735,
    rateYPosRatio: 0.575,
    playXRatio: 0.55,
    rateXRatio: 1,
    scoreXRatio: 1.45
  }
};

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
    const buttonY = this.game.height * StartSceneConfig.BUTTONS.yPosRatio;

    this.playButton = new Button(
      this.renderer,
      'button_play',
      midX * StartSceneConfig.BUTTONS.playXRatio,
      buttonY,
      () => this.transitionToReady()
    );

    this.rateButton = new Button(
      this.renderer,
      'button_rate',
      midX * StartSceneConfig.BUTTONS.rateXRatio,
      this.game.height * StartSceneConfig.BUTTONS.rateYPosRatio,
      () => window.open('https://github.com/mapuya19/flappy-js', '_blank')
    );

    this.scoreButton = new Button(
      this.renderer,
      'button_score',
      midX * StartSceneConfig.BUTTONS.scoreXRatio,
      buttonY,
      () => this.transitionToScoreboard()
    );
  }

  transitionToReady() {
    this.game.sounds.swoosh?.play();
    this.game.triggerFadeToReady();
  }

  transitionToScoreboard() {
    this.game.sounds.swoosh?.play();
    this.game.transitionTo(GameState.SCOREBOARD);
  }

  update(deltaTime) {
    this.birdTimer += deltaTime;
    this.birdY = Math.sin(this.birdTimer * StartSceneConfig.BIRD.hoverFrequency) * StartSceneConfig.BIRD.hoverAmplitude;
    this.game.bird.updateAnimation(deltaTime);
  }

  draw(_ctx) {
    if (this.game.background) {
      this.game.background.draw(this.renderer);
    }

    if (this.game.ground) {
      this.game.ground.draw();
    }

    const birdSprite = this.game.bird.getSpriteName();
    this.renderer.drawSprite(
      birdSprite,
      this.game.width / 2,
      this.game.height * StartSceneConfig.BIRD.yPosRatio + this.birdY
    );

    this.renderer.drawSprite('title', this.game.width / 2, this.game.height * StartSceneConfig.TITLE.yPosRatio);

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
