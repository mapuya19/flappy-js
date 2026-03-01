const ParticleConfig = {
  LIFE: {
    initial: 1.0,
    minDecay: 0.02,
    maxDecay: 0.04
  },
  PHYSICS: {
    gravity: 200,
    decayMultiplier: 60
  },
  RENDERING: {
    fullCircle: Math.PI * 2
  },
  EMIT: {
    colors: ['#FFE666', '#FF6B6B', '#4CAF50'],
    minVelocity: { x: -100, y: -150 },
    maxVelocity: { x: 100, y: -50 },
    minSize: 3,
    maxSize: 8
  }
};

export default class Particle {
  constructor(x, y, color, velocity, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.size = size;
    this.life = ParticleConfig.LIFE.initial;
    this.decay = Math.random() * (ParticleConfig.LIFE.maxDecay - ParticleConfig.LIFE.minDecay) + ParticleConfig.LIFE.minDecay;
  }
  
  update(deltaTime) {
    this.x += this.velocity.x * deltaTime;
    this.y += this.velocity.y * deltaTime;
    this.velocity.y += ParticleConfig.PHYSICS.gravity * deltaTime;
    this.life -= this.decay * deltaTime * ParticleConfig.PHYSICS.decayMultiplier;
  }
  
  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, ParticleConfig.RENDERING.fullCircle);
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
      colors = ParticleConfig.EMIT.colors,
      minVelocity = ParticleConfig.EMIT.minVelocity,
      maxVelocity = ParticleConfig.EMIT.maxVelocity,
      minSize = ParticleConfig.EMIT.minSize,
      maxSize = ParticleConfig.EMIT.maxSize
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
      ctx.arc(particle.x, particle.y, particle.size, 0, ParticleConfig.RENDERING.fullCircle);
      ctx.fill();
    });
    ctx.restore();
  }
  
  clear() {
    this.particles = [];
  }
}
