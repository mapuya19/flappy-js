export default class Background {
  constructor(width, height, groundSpeed = 120) {
    this.width = width;
    this.height = height;
    this.groundSpeed = groundSpeed;
    this.dayMode = true;
  }

  update(_deltaTime, _speedMultiplier = 0) {
  }

  draw(renderer) {
    const bgSprite = this.dayMode ? 'bg_day' : 'bg_night';
    renderer.drawSprite(bgSprite, this.width / 2, this.height / 2);
  }

  setDayMode(dayMode) {
    this.dayMode = dayMode;
  }
}
