export class ScorePanel {
  constructor(renderer, x, y) {
    this.renderer = renderer;
    this.x = x;
    this.y = y;
    this.visible = false;
    this.currentScore = 0;
    this.bestScore = 0;
    this.medal = null;
    this.showNew = false;
    this.animationTime = 0;
    this.currentY = y;
  }

  show(currentScore, bestScore) {
    this.visible = true;
    this.currentScore = currentScore;
    this.bestScore = bestScore;
    // this.medal = 'medals_1' // test medals
    this.medal = this.getMedal(currentScore);
    this.showNew = currentScore > bestScore;
    this.animationTime = 0;
    this.currentY = -100;
  }

  hide() {
    this.visible = false;
  }

  getMedal(score) {
    if (score >= 40) return 'medals_0';
    if (score >= 30) return 'medals_1';
    if (score >= 20) return 'medals_2';
    if (score >= 10) return 'medals_3';
    return null;
  }

  update(deltaTime) {
    if (!this.visible) return;

    this.animationTime += deltaTime;

    if (this.animationTime < 0.2) {
      const progress = this.animationTime / 0.2;
      const easeProgress = progress * (2 - progress);
      this.currentY = -100 + (this.y + 100) * easeProgress;
    } else {
      this.currentY = this.y;
    }
  }

  draw(_ctx) {
    if (!this.visible) return;

    this.renderer.drawSprite('score_panel', this.x, this.currentY);

    if (this.medal) {
      this.renderer.drawSprite(this.medal, this.x - 65, this.currentY + 3);
    }

    if (this.showNew) {
      this.renderer.drawSprite('new', this.x - 70, this.currentY - 55);
    }

    this.drawScore(this.currentScore, this.x + 80, this.currentY - 17);
    this.drawScore(this.bestScore, this.x + 80, this.currentY + 25);
  }

  drawScore(score, x, y) {
    const scoreStr = score.toString();
    const digitWidth = 14;
    const totalWidth = scoreStr.length * digitWidth;
    let currentX = x - totalWidth / 2;

    for (const digit of scoreStr) {
      const spriteName = `number_score_0${digit}`;
      this.renderer.drawSprite(spriteName, currentX, y);
      currentX += digitWidth;
    }
  }
}
