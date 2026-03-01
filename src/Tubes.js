const TubesConfig = {
  GROUND: {
    heightOffset: 112,
    topPadding: 56
  },
  SPAWN: {
    minY: 50,
    bottomPadding: 30,
    removalThreshold: -100
  },
  COLLISION: {
    hitboxRadius: 10,
    pipeCapOffset: 28
  },
  ATLAS: {
    pipeTopX: 112,
    pipeTopY: 646,
    pipeBottomX: 168,
    pipeBottomY: 646
  }
};

export default class Tubes {
  constructor(config = {}) {
    this.width = config.width || 52;
    this.height = config.height || 320;
    this.gap = config.gap || 100;
    this.speed = config.speed || 90;
    this.spacing = config.spacing || 420;
    this.spawnInterval = config.spawnInterval || 2.0;

    this.pipes = [];
    this.pipeStates = [];
    this.spawnTimer = 0;

    this.canvasHeight = config.canvasHeight || 512;
    this.canvasWidth = config.canvasWidth || 288;
  }

  reset() {
    this.pipes = [];
    this.pipeStates = [];
    this.spawnTimer = 0;
    this.spawnPipe();
    this.spawnTimer = 0;
  }

  update(deltaTime, birdX) {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnPipe();
      this.spawnTimer = 0;
    }

    let scored = false;

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.x -= this.speed * deltaTime;

      if (this.pipeStates[i] === 0 && pipe.x < birdX + 16) {
        this.pipeStates[i] = 1;
        scored = true;
      }

      if (pipe.x <= TubesConfig.SPAWN.removalThreshold) {
        this.pipes.splice(i, 1);
        this.pipeStates.splice(i, 1);
      }
    }

    return scored;
  }

  spawnPipe() {
    const groundY = this.canvasHeight - TubesConfig.GROUND.heightOffset;
    const usableHeight = groundY - TubesConfig.GROUND.topPadding - this.gap;
    const minY = TubesConfig.SPAWN.minY;
    const maxY = usableHeight - TubesConfig.SPAWN.bottomPadding;
    const randomY = Math.random() * (maxY - minY) + minY;

    this.pipes.push({
      x: this.canvasWidth + this.width,
      yOffset: randomY - this.height / 2,
      passed: false
    });

    this.pipeStates.push(0);
  }

  draw(ctx) {
    const groundY = this.canvasHeight - TubesConfig.GROUND.heightOffset;

    for (const pipe of this.pipes) {
      const pipeTopY = pipe.yOffset + this.height / 2;
      const pipeBottomY = pipe.yOffset + this.height / 2 + this.gap;

      const topPipeHeight = Math.min(pipeTopY + TubesConfig.COLLISION.pipeCapOffset, groundY - TubesConfig.COLLISION.pipeCapOffset);
      ctx.drawImage(
        this.atlasImage,
        TubesConfig.ATLAS.pipeTopX, TubesConfig.ATLAS.pipeTopY + (this.height - topPipeHeight), this.width, topPipeHeight,
        pipe.x - this.width / 2, 0, this.width, topPipeHeight
      );

      const bottomPipeHeight = groundY - pipeBottomY;
      if (bottomPipeHeight > 0) {
        ctx.drawImage(
          this.atlasImage,
          TubesConfig.ATLAS.pipeBottomX, TubesConfig.ATLAS.pipeBottomY, this.width, bottomPipeHeight,
          pipe.x - this.width / 2, pipeBottomY, this.width, bottomPipeHeight
        );
      }
    }
  }

  setAtlas(atlasImage) {
    this.atlasImage = atlasImage;
  }

  setCanvasHeight(h) {
    this.canvasHeight = h;
  }

  checkCollision(bird) {
    const hitboxRadius = TubesConfig.COLLISION.hitboxRadius;
    
    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];
      const pipeLeft = pipe.x - this.width / 2;
      const pipeRight = pipe.x + this.width / 2;
      const pipeTopY = pipe.yOffset + this.height / 2;
      const pipeBottomY = pipe.yOffset + this.height / 2 + this.gap;

      const birdLeft = bird.x - hitboxRadius;
      const birdRight = bird.x + hitboxRadius;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (bird.y - hitboxRadius < pipeTopY + TubesConfig.COLLISION.pipeCapOffset || bird.y + hitboxRadius > pipeBottomY) {
          return true;
        }
      }
    }
    return false;
  }
}
