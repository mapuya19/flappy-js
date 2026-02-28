export default class Bird {
  constructor(x, y, canvasHeight, gravity = 0.3, jumpForce = -8.0) {
    this.x = x;
    this.y = y;
    this.canvasHeight = canvasHeight;
    this.radius = 17;
    this.velocity = 0;
    this.gravity = gravity;
    this.jumpForce = jumpForce;
  }
  
  jump() {
    if (this.velocity > -4) {
      this.velocity = this.jumpForce;
    }
  }
  
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    
    this.y = Math.max(this.radius, Math.min(this.y, this.canvasHeight - this.radius));
  }
  
  draw(ctx, hoverOffset = 0) {
    ctx.save();
    
    const x = this.x;
    const y = this.y + hoverOffset;
    const size = this.radius * 2;
    
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.ellipse(x, y, size / 2, size / 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    const wingAngle = Math.min(Math.max(this.velocity * 0.1, -0.5), 0.5);
    ctx.save();
    ctx.translate(x - 5, y + 5);
    ctx.rotate(wingAngle);
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.ellipse(0, 8, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x + 10, y - 5, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + 12, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + 13, y - 6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FF6D00';
    ctx.beginPath();
    ctx.moveTo(x + 15, y + 2);
    ctx.lineTo(x + 28, y + 5);
    ctx.lineTo(x + 15, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  }
  
  checkCollision(tubes) {
    const canvasHeight = 600;
    
    if (this.y >= canvasHeight - this.radius) {
      return true;
    }
    
    return tubes.checkCollision(this);
  }
}
