export class Button {
  constructor(renderer, spriteName, x, y, onClick) {
    this.renderer = renderer;
    this.spriteName = spriteName;
    this.x = x;
    this.y = y;
    this.onClick = onClick;
    this.isPressed = false;
    this.size = renderer.getSpriteSize(spriteName);
  }

  draw() {
    const yOffset = this.isPressed ? 3 : 0;
    this.renderer.drawSprite(this.spriteName, this.x, this.y + yOffset);
  }

  handleInput(inputX, inputY) {
    const halfWidth = this.size.width / 2;
    const halfHeight = this.size.height / 2;

    const inBounds =
      inputX >= this.x - halfWidth &&
      inputX <= this.x + halfWidth &&
      inputY >= this.y - halfHeight &&
      inputY <= this.y + halfHeight;

    if (inBounds && !this.isPressed) {
      this.isPressed = true;
      return true;
    } else if (!inBounds && this.isPressed) {
      this.isPressed = false;
    }

    return false;
  }

  handleRelease(inputX, inputY) {
    if (this.isPressed) {
      this.isPressed = false;
      const halfWidth = this.size.width / 2;
      const halfHeight = this.size.height / 2;

      const inBounds =
        inputX >= this.x - halfWidth &&
        inputX <= this.x + halfWidth &&
        inputY >= this.y - halfHeight &&
        inputY <= this.y + halfHeight;

      if (inBounds && this.onClick) {
        this.onClick();
        return true;
      }
    }
    return false;
  }
}
