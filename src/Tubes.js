export default class Tubes {
  constructor(canvasWidth, canvasHeight, config = {}) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.tubeWidth = config.width || 78;
    this.gap = config.gap || 130;
    this.minimum = config.minimum || 130;
    this.speed = config.speed || 3.0;
    this.tubeSpacing = config.spacing || 250;
    
    this.topTube = 0;
    this.bottomTube = 0;
    this.topTube2 = 0;
    this.bottomTube2 = 0;
    
    this.posX = canvasWidth;
    this.posX2 = canvasWidth + this.tubeSpacing;
    
    this.tube1Passed = false;
    this.tube2Passed = false;
    
    this.resetTube1();
    this.resetTube2();
  }
  
  resetTube1() {
    this.topTube = Math.random() * (this.canvasHeight - this.minimum - this.minimum) + this.minimum;
    this.bottomTube = this.topTube + this.gap;
    this.tube1Passed = false;
  }
  
  resetTube2() {
    this.topTube2 = Math.random() * (this.canvasHeight - this.minimum - this.minimum) + this.minimum;
    this.bottomTube2 = this.topTube2 + this.gap;
    this.tube2Passed = false;
  }
  
  update(birdAlive) {
    if (birdAlive) {
      this.posX -= this.speed;
      this.posX2 -= this.speed;
      
      if (this.posX + this.tubeWidth < 0) {
        this.resetTube1();
        this.posX = this.canvasWidth;
      }
      
      if (this.posX2 + this.tubeWidth < 0) {
        this.resetTube2();
        this.posX2 = this.canvasWidth;
      }
    }
  }
  
  drawPipe(ctx, x, topHeight, bottomY) {
    const pipeWidth = this.tubeWidth;
    const capHeight = 28;
    const capOverhang = 6;
    
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;
    
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(x, 0, pipeWidth, topHeight - capHeight);
    ctx.strokeRect(x, 0, pipeWidth, topHeight - capHeight);
    
    ctx.fillStyle = '#66BB6A';
    ctx.fillRect(x, 0, pipeWidth * 0.3, topHeight - capHeight);
    
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(x - capOverhang, topHeight - capHeight, pipeWidth + capOverhang * 2, capHeight);
    ctx.strokeRect(x - capOverhang, topHeight - capHeight, pipeWidth + capOverhang * 2, capHeight);
    
    ctx.fillStyle = '#66BB6A';
    ctx.fillRect(x - capOverhang, topHeight - capHeight, (pipeWidth + capOverhang * 2) * 0.3, capHeight);
    
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(x, bottomY, pipeWidth, this.canvasHeight - bottomY);
    ctx.strokeRect(x, bottomY, pipeWidth, this.canvasHeight - bottomY);
    
    ctx.fillStyle = '#66BB6A';
    ctx.fillRect(x, bottomY, pipeWidth * 0.3, this.canvasHeight - bottomY);
    
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(x - capOverhang, bottomY, pipeWidth + capOverhang * 2, capHeight);
    ctx.strokeRect(x - capOverhang, bottomY, pipeWidth + capOverhang * 2, capHeight);
    
    ctx.fillStyle = '#66BB6A';
    ctx.fillRect(x - capOverhang, bottomY, (pipeWidth + capOverhang * 2) * 0.3, capHeight);
  }
  
  draw(ctx) {
    this.drawPipe(ctx, this.posX, this.topTube, this.bottomTube);
    this.drawPipe(ctx, this.posX2, this.topTube2, this.bottomTube2);
  }
  
  checkCollision(bird) {
    const birdLeft = bird.x - bird.radius;
    const birdRight = bird.x + bird.radius;
    const birdTop = bird.y - bird.radius * 0.8;
    const birdBottom = bird.y + bird.radius * 0.8;
    
    const tubesToCheck = [
      { x: this.posX, top: this.topTube, bottom: this.bottomTube },
      { x: this.posX2, top: this.topTube2, bottom: this.bottomTube2 }
    ];
    
    for (const tube of tubesToCheck) {
      const tubeLeft = tube.x;
      const tubeRight = tube.x + this.tubeWidth;
      
      if (birdRight > tubeLeft && birdLeft < tubeRight) {
        if (birdTop < tube.top || birdBottom > tube.bottom) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  checkScore(bird) {
    const halfwayPoint1 = this.posX + this.tubeWidth / 2;
    const halfwayPoint2 = this.posX2 + this.tubeWidth / 2;
    
    if (!this.tube1Passed && bird.x > halfwayPoint1) {
      this.tube1Passed = true;
      return true;
    }
    
    if (!this.tube2Passed && bird.x > halfwayPoint2) {
      this.tube2Passed = true;
      return true;
    }
    
    return false;
  }
}
