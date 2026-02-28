export default class ScreenShake {
  constructor(intensity = 10, duration = 0.3) {
    this.intensity = intensity;
    this.duration = duration;
    this.currentTime = 0;
    this.active = false;
  }
  
  shake(intensity = this.intensity, duration = this.duration) {
    this.intensity = intensity;
    this.duration = duration;
    this.currentTime = duration;
    this.active = true;
  }
  
  update(deltaTime) {
    if (this.active) {
      this.currentTime -= deltaTime;
      
      if (this.currentTime <= 0) {
        this.active = false;
        return { x: 0, y: 0 };
      }
      
      const progress = this.currentTime / this.duration;
      const currentIntensity = this.intensity * progress;
      
      return {
        x: (Math.random() - 0.5) * currentIntensity * 2,
        y: (Math.random() - 0.5) * currentIntensity * 2
      };
    }
    
    return { x: 0, y: 0 };
  }
  
  isActive() {
    return this.active;
  }
}
