const HIGH_SCORE_KEY = 'flappyjs_highscore';

export function getHighScore() {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.warn('Failed to get high score:', error);
    return 0;
  }
}

export function setHighScore(score) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.warn('Failed to set high score:', error);
  }
}

export function clearHighScore() {
  try {
    localStorage.removeItem(HIGH_SCORE_KEY);
  } catch (error) {
    console.warn('Failed to clear high score:', error);
  }
}
