export default class Background {
  constructor(width, height, groundSpeed = 120) {
    this.width = width;
    this.height = height;
    this.groundSpeed = groundSpeed;
    this.dayMode = true;
  }

  update(_deltaTime, _speedMultiplier = 0) {
  }

  draw(_ctx) {
  }
}
