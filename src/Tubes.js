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

      if (this.pipeStates[i] === 0 && pipe.x < birdX) {
        this.pipeStates[i] = 1;
        scored = true;
      }

      if (pipe.x <= -100) {
        this.pipes.splice(i, 1);
        this.pipeStates.splice(i, 1);
      }
    }

    return scored;
  }

  spawnPipe() {
    const groundY = this.canvasHeight - 112;
    const usableHeight = groundY - 56 - this.gap;
    const minY = 50;
    const maxY = usableHeight - 30;
    const randomY = Math.random() * (maxY - minY) + minY;

    this.pipes.push({
      x: this.canvasWidth + this.width,
      yOffset: randomY - this.height / 2,
      passed: false
    });

    this.pipeStates.push(0);
  }

  draw(ctx) {
    const groundY = this.canvasHeight - 112;

    for (const pipe of this.pipes) {
      const pipeTopY = pipe.yOffset + this.height / 2;
      const pipeBottomY = pipe.yOffset + this.height / 2 + this.gap;

      const topPipeHeight = Math.min(pipeTopY + 28, groundY - 28);
      ctx.drawImage(
        this.atlasImage,
        112, 646 + (this.height - topPipeHeight), this.width, topPipeHeight,
        pipe.x - this.width / 2, 0, this.width, topPipeHeight
      );

      const bottomPipeHeight = groundY - pipeBottomY;
      if (bottomPipeHeight > 0) {
        ctx.drawImage(
          this.atlasImage,
          168, 646, this.width, bottomPipeHeight,
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
    const hitboxRadius = 10;
    
    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];
      const pipeLeft = pipe.x - this.width / 2;
      const pipeRight = pipe.x + this.width / 2;
      const pipeTopY = pipe.yOffset + this.height / 2;
      const pipeBottomY = pipe.yOffset + this.height / 2 + this.gap;

      const birdLeft = bird.x - hitboxRadius;
      const birdRight = bird.x + hitboxRadius;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (bird.y - hitboxRadius < pipeTopY + 28 || bird.y + hitboxRadius > pipeBottomY) {
          return true;
        }
      }
    }
    return false;
  }
}
