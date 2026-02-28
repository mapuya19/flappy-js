export default class Score {
  draw(ctx, score, font) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const text = 'Score: ' + score;
    const x = ctx.canvas.width / 2;
    const y = 60;
    
    ctx.font = `64px ${font || 'Arial'}`;
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
    
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
  }
}
