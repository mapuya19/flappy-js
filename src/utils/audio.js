export async function loadSounds() {
  const base = import.meta.env.BASE_URL;
  try {
    const [point, wing, hit, die] = await Promise.all([
      loadSound(`${base}assets/point.wav`),
      loadSound(`${base}assets/wing.mp3`),
      loadSound(`${base}assets/hit.mp3`),
      loadSound(`${base}assets/die.mp3`)
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
    let resolved = false;

    const doResolve = (value) => {
      if (!resolved) {
        resolved = true;
        resolve(value);
      }
    };

    const timeout = setTimeout(() => {
      console.warn(`Audio timeout for ${url}, using anyway`);
      doResolve(audio);
    }, 5000);

    audio.addEventListener('canplay', () => {
      clearTimeout(timeout);
      doResolve(audio);
    }, { once: true });

    audio.addEventListener('canplaythrough', () => {
      clearTimeout(timeout);
      doResolve(audio);
    }, { once: true });

    audio.addEventListener('error', (e) => {
      clearTimeout(timeout);
      console.warn(`Failed to load audio ${url}:`, e);
      doResolve(null);
    }, { once: true });
  });
}
