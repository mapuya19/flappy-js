export default class Bird {
  constructor(config) {
    this.x = config.x || 90;
    this.y = 0;
    this.canvasHeight = config.canvasHeight || 512;
    this.radius = config.radius || 15;
    this.velocity = 0;
    this.gravity = config.gravity || 900;
    this.tapVelocity = config.tapVelocity || -260;
    this.rotation = 0;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.birdColor = config.birdColor !== undefined ? config.birdColor : 0;
  }

  reset() {
    this.y = this.canvasHeight / 2;
    this.velocity = 0;
    this.rotation = 0;
    this.currentFrame = 0;
    this.frameTimer = 0;
  }

  update(deltaTime) {
    this.velocity += this.gravity * deltaTime;
    this.y += this.velocity * deltaTime;

    const targetRotation = Math.min(Math.max(this.velocity * 0.12 - 25, -90), 90) * Math.PI / 180;
    this.rotation += (targetRotation - this.rotation) * 0.15;

    this.frameTimer += deltaTime;
    if (this.frameTimer >= 0.1) {
      this.currentFrame = (this.currentFrame + 1) % 3;
      this.frameTimer = 0;
    }
  }

  jump() {
    this.velocity = this.tapVelocity;
  }

  getSpriteName() {
    const color = this.birdColor !== undefined ? this.birdColor : 0;
    const frame = this.currentFrame !== undefined ? this.currentFrame : 0;
    return `bird${color}_${frame}`;
  }
}
