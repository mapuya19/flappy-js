const GroundConfig = {
  DIMENSIONS: {
    height: 112,
    spriteWidth: 336,
    spriteHeight: 112
  },
  ATLAS: {
    x: 584,
    y: 0
  }
};

export default class Ground {
  constructor(width, height, speed) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.offset = 0;
    this.groundHeight = GroundConfig.DIMENSIONS.height;
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
    const { spriteWidth, spriteHeight } = GroundConfig.DIMENSIONS;
    const offset = Math.floor(this.offset);

    this.ctx.drawImage(
      this.atlasImage,
      GroundConfig.ATLAS.x, GroundConfig.ATLAS.y, spriteWidth, spriteHeight,
      -offset, groundY, spriteWidth, spriteHeight
    );

    this.ctx.drawImage(
      this.atlasImage,
      GroundConfig.ATLAS.x, GroundConfig.ATLAS.y, spriteWidth, spriteHeight,
      spriteWidth - offset, groundY, spriteWidth, spriteHeight
    );
  }

  setContext(ctx) {
    this.ctx = ctx;
  }
}
