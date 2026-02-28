export async function loadSounds() {
  try {
    const [point, wing, hit, die] = await Promise.all([
      loadSound('/assets/point.wav'),
      loadSound('/assets/wing.mp3'),
      loadSound('/assets/hit.mp3'),
      loadSound('/assets/die.mp3')
    ]);
    
    return { point, wing, hit, die };
  } catch (error) {
    console.warn('Failed to load sounds:', error);
    return {};
  }
}

export async function loadFont(url) {
  return new Promise((resolve) => {
    const font = new FontFace('FlappyFont', `url(${url})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      resolve('FlappyFont');
    }).catch(() => {
      resolve('Arial');
    });
  });
}

function loadSound(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener('canplaythrough', () => {
      resolve(audio);
    }, { once: true });
    
    audio.addEventListener('error', () => {
      resolve(null);
    }, { once: true });
  });
}
