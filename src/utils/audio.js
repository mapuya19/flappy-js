class Sound {
  constructor(buffer) {
    this.buffer = buffer;
    this.audioContext = null;
  }

  play() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 44100
        });
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.buffer;
      
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.3;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
    } catch {
      // Intentionally suppress audio play errors
    }
  }
}

async function loadAudioBuffer(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (e) {
    console.warn(`Failed to load audio buffer from ${url}:`, e);
    return null;
  }
}

async function decodeAudioBuffer(arrayBuffer) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 44100
    });
    const buffer = await audioContext.decodeAudioData(arrayBuffer);
    audioContext.close();
    return buffer;
  } catch (e) {
    console.warn('Failed to decode audio buffer:', e);
    return null;
  }
}

export async function loadSounds() {
  const base = import.meta.env.BASE_URL;
  try {
    const [pointBuffer, wingBuffer, hitBuffer, dieBuffer] = await Promise.all([
      loadAudioBuffer(`${base}assets/point.m4a`),
      loadAudioBuffer(`${base}assets/wing.m4a`),
      loadAudioBuffer(`${base}assets/hit.m4a`),
      loadAudioBuffer(`${base}assets/die.m4a`)
    ]);

    const [point, wing, hit, die] = await Promise.all([
      decodeAudioBuffer(pointBuffer),
      decodeAudioBuffer(wingBuffer),
      decodeAudioBuffer(hitBuffer),
      decodeAudioBuffer(dieBuffer)
    ]);

    return {
      point: point ? new Sound(point) : null,
      wing: wing ? new Sound(wing) : null,
      hit: hit ? new Sound(hit) : null,
      die: die ? new Sound(die) : null
    };
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
