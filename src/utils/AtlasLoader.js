export class AtlasLoader {
  constructor() {
    this.atlasImage = null;
    this.spriteData = null;
    this.loaded = false;
  }

  async load() {
    const base = import.meta.env.BASE_URL;

    const [image, jsonData] = await Promise.all([
      this.loadImage(`${base}assets/sprites/atlas.png`),
      fetch(`${base}assets/sprites/atlas.json`).then(r => r.json())
    ]);

    this.atlasImage = image;
    this.spriteData = jsonData;
    this.loaded = true;
  }

  getSprite(name) {
    if (!this.loaded || !this.spriteData[name]) {
      return null;
    }
    return {
      image: this.atlasImage,
      ...this.spriteData[name]
    };
  }

  loadImage(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = path;
    });
  }
}
