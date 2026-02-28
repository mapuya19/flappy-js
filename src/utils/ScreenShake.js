export default class ScreenShake {
  constructor(intensity = 10, duration = 0.3) {
    this.intensity = intensity;
    this.duration = duration;
    this.currentTime = 0;
    this.active = false;
    this.currentShake = { x: 0, y: 0 };
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
        this.currentShake = { x: 0, y: 0 };
        return;
      }
      
      const progress = this.currentTime / this.duration;
      const currentIntensity = this.intensity * progress;
      
      this.currentShake = {
        x: (Math.random() - 0.5) * currentIntensity * 2,
        y: (Math.random() - 0.5) * currentIntensity * 2
      };
    } else {
      this.currentShake = { x: 0, y: 0 };
    }
  }
  
  getShake() {
    return this.currentShake;
  }
  
  isActive() {
    return this.active;
  }
}
