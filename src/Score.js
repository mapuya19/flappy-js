export default class Score {
  draw(ctx, score, font) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const text = 'Score: ' + score;
    const x = ctx.canvas.width / 2;
    const y = 60;
    
    ctx.font = `64px ${font || 'Arial'}`;
    
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, x, y);
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}
