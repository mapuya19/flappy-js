export default class Particle {
  constructor(x, y, color, velocity, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.size = size;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.02;
  }
  
  update(deltaTime) {
    this.x += this.velocity.x * deltaTime;
    this.y += this.velocity.y * deltaTime;
    this.velocity.y += 200 * deltaTime;
    this.life -= this.decay * deltaTime * 60;
  }
  
  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  isDead() {
    return this.life <= 0;
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }
  
  emit(x, y, count, options = {}) {
    const {
      colors = ['#FFE666', '#FF6B6B', '#4CAF50'],
      minVelocity = { x: -100, y: -150 },
      maxVelocity = { x: 100, y: -50 },
      minSize = 3,
      maxSize = 8
    } = options;
    
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const velocity = {
        x: Math.random() * (maxVelocity.x - minVelocity.x) + minVelocity.x,
        y: Math.random() * (maxVelocity.y - minVelocity.y) + minVelocity.y
      };
      const size = Math.random() * (maxSize - minSize) + minSize;
      
      this.particles.push(new Particle(x, y, color, velocity, size));
    }
  }
  
  update(deltaTime) {
    this.particles.forEach(particle => particle.update(deltaTime));
    this.particles = this.particles.filter(particle => !particle.isDead());
  }
  
  draw(ctx) {
    ctx.save();
    this.particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
  
  clear() {
    this.particles = [];
  }
}
