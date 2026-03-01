export class ScorePanel {
  constructor(renderer, x, y) {
    this.renderer = renderer;
    this.x = x;
    this.y = y;
    this.visible = false;
    this.currentScore = 0;
    this.displayScore = 0;
    this.bestScore = 0;
    this.medal = null;
    this.showNew = false;
    this.isNewRecord = false;
    this.animationTime = 0;
    this.currentY = y;
    this.scoreAnimationTime = 0;
    this.scoreAnimationDuration = 0;
    this.scoreAnimating = false;
    this.panelMovedIn = false;
  }

  show(currentScore, bestScore) {
    this.visible = true;
    this.currentScore = currentScore;
    this.displayScore = 0;
    this.bestScore = bestScore;
    // this.medal = 'medals_1' // test medals
    this.medal = this.getMedal(currentScore);
    this.isNewRecord = currentScore > bestScore;
    this.showNew = false;
    this.animationTime = 0;
    this.currentY = -100;
    this.scoreAnimating = false;
    this.panelMovedIn = false;
    this.scoreAnimationTime = 0;
    this.scoreAnimationDuration = currentScore > 0 ? 0.5 : 0;
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

  startScoreAnimation() {
    if (this.currentScore > 0) {
      this.scoreAnimating = true;
      this.scoreAnimationTime = 0;
    }
  }

  isScoreAnimationComplete() {
    return !this.scoreAnimating && this.currentScore > 0;
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
      if (!this.panelMovedIn) {
        this.panelMovedIn = true;
      }
    }

    if (this.scoreAnimating) {
      this.scoreAnimationTime += deltaTime;
      if (this.scoreAnimationTime < this.scoreAnimationDuration) {
        const progress = this.scoreAnimationTime / this.scoreAnimationDuration;
        this.displayScore = Math.floor(this.currentScore * progress);
      } else {
        this.displayScore = this.currentScore;
        this.scoreAnimating = false;
        if (this.isNewRecord) {
          this.showNew = true;
        }
      }
    }
  }

  draw(_ctx) {
    if (!this.visible) return;

    this.renderer.drawSprite('score_panel', this.x, this.currentY);

    if (this.medal) {
      this.renderer.drawSprite(this.medal, this.x - 65, this.currentY + 3);
    }

    if (this.showNew) {
      this.renderer.drawSprite('new', this.x + 110, this.currentY + 25);
    }

    this.drawScore(this.displayScore, this.x + 80, this.currentY - 17);

    const bestScoreToShow = this.showNew ? this.currentScore : this.bestScore;
    this.drawScore(bestScoreToShow, this.x + 80, this.currentY + 25);
  }

  drawScore(score, x, y) {
    const scoreStr = score.toString();
    const digitWidth = 15;
    const numDigits = scoreStr.length;
    let currentX = x - (numDigits - 1) * digitWidth;

    for (const digit of scoreStr) {
      const spriteName = `number_score_0${digit}`;
      this.renderer.drawSprite(spriteName, currentX, y);
      currentX += digitWidth;
    }
  }
}
