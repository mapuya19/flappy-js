export default class Background {
  constructor(width, height, groundSpeed = 3.0) {
    this.width = width;
    this.height = height;
    this.groundOffset = 0;
    this.groundSpeed = groundSpeed;
    
    this.clouds = [];
    this.buildings = [];
    
    this.initClouds();
    this.initBuildings();
  }
  
  initClouds() {
    const cloudPositions = [
      { x: 50, y: 80, scale: 1 },
      { x: 200, y: 120, scale: 0.8 },
      { x: 350, y: 60, scale: 1.1 },
      { x: 500, y: 100, scale: 0.9 },
      { x: 150, y: 150, scale: 0.7 }
    ];
    
    cloudPositions.forEach(pos => {
      this.clouds.push({
        ...pos,
        opacity: Math.random() * 0.4 + 0.3
      });
    });
  }
  
  initBuildings() {
    const buildingData = [
      { x: 0, width: 60, height: 80, color: '#87CEEB' },
      { x: 80, width: 50, height: 120, color: '#87CEEB' },
      { x: 150, width: 70, height: 90, color: '#87CEEB' },
      { x: 240, width: 40, height: 140, color: '#87CEEB' },
      { x: 300, width: 80, height: 100, color: '#87CEEB' },
      { x: 400, width: 60, height: 110, color: '#87CEEB' },
      { x: 480, width: 50, height: 85, color: '#87CEEB' }
    ];
    
    buildingData.forEach(b => {
      this.buildings.push(b);
    });
  }
  
  update(deltaTime, speedMultiplier = 1) {
    this.groundOffset -= this.groundSpeed * deltaTime * 60 * speedMultiplier;
    
    if (this.groundOffset <= -24) {
      this.groundOffset = 0;
    }
  }
  
  draw(ctx) {
    this.drawSky(ctx);
    this.drawBuildings(ctx);
    this.drawClouds(ctx);
    this.drawGround(ctx);
  }
  
  drawSky(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#4EC0CA');
    gradient.addColorStop(1, '#70C5CE');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }
  
  drawBuildings(ctx) {
    this.buildings.forEach(building => {
      ctx.fillStyle = '#A7D7D5';
      const buildingY = this.height - 112 - building.height;
      ctx.fillRect(building.x, buildingY, building.width, building.height);
      
      ctx.fillStyle = '#6FB3B0';
      ctx.fillRect(building.x + 3, buildingY + 3, building.width - 6, building.height - 3);
    });
  }
  
  drawClouds(ctx) {
    ctx.save();
    
    this.clouds.forEach(cloud => {
      ctx.globalAlpha = cloud.opacity;
      ctx.fillStyle = 'white';
      
      const x = cloud.x;
      const y = cloud.y;
      const s = cloud.scale;
      
      ctx.beginPath();
      ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
      ctx.arc(x + 18 * s, y - 8 * s, 14 * s, 0, Math.PI * 2);
      ctx.arc(x + 32 * s, y, 16 * s, 0, Math.PI * 2);
      ctx.arc(x + 14 * s, y + 6 * s, 12 * s, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
  
  drawGround(ctx) {
    const groundY = this.height - 112;
    
    ctx.fillStyle = '#DED895';
    ctx.fillRect(0, groundY, this.width, 112);
    
    ctx.fillStyle = '#D2C879';
    for (let i = this.groundOffset; i < this.width + 24; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, groundY);
      ctx.lineTo(i + 12, groundY + 12);
      ctx.lineTo(i + 24, groundY);
      ctx.fill();
    }
    
    ctx.strokeStyle = '#543847';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.stroke();
    
    ctx.fillStyle = '#73BF2E';
    ctx.fillRect(0, groundY + 12, this.width, 12);
    
    ctx.strokeStyle = '#543847';
    ctx.beginPath();
    ctx.moveTo(0, groundY + 12);
    ctx.lineTo(this.width, groundY + 12);
    ctx.stroke();
  }
}
