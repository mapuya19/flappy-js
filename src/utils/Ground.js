export default class Ground {
  constructor(width, height, speed) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.offset = 0;
    this.groundHeight = 112;
    this.atlasImage = null;
  }

  setAtlas(atlasImage) {
    this.atlasImage = atlasImage;
  }

  update(deltaTime, speedMultiplier = 1) {
    this.offset += this.speed * deltaTime * speedMultiplier;
    if (this.offset >= this.width) {
      this.offset -= this.width;
    }
  }

  draw() {
    if (!this.atlasImage) return;

    const groundY = this.height - this.groundHeight;
    const spriteWidth = 336;
    const spriteHeight = 112;
    const offset = Math.floor(this.offset);

    this.ctx.drawImage(
      this.atlasImage,
      584, 0, spriteWidth, spriteHeight,
      -offset, groundY, spriteWidth, spriteHeight
    );

    this.ctx.drawImage(
      this.atlasImage,
      584, 0, spriteWidth, spriteHeight,
      spriteWidth - offset, groundY, spriteWidth, spriteHeight
    );
  }

  setContext(ctx) {
    this.ctx = ctx;
  }
}
