export class BaseScene {
  constructor(game) {
    this.game = game;
    this.atlas = game.atlas;
    this.renderer = game.renderer;
    this.ctx = game.ctx;
  }

  update(_deltaTime) {}
  draw(_ctx) {}
  handleInput(_x, _y) {}
  handleRelease(_x, _y) {}
  onEnter(..._args) {}
  onExit() {}
}
