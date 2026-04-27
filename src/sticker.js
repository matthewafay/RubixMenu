import { CanvasTexture, SRGBColorSpace } from 'three';

export function makeStickerTexture({ name = '', price = 0, kind = 'item', color = '#f5f5f5' }) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');

  g.fillStyle = '#0a0a0a';
  g.fillRect(0, 0, 256, 256);

  if (kind === 'blank') {
    roundRect(g, 12, 12, 232, 232, 24);
    g.fillStyle = '#1a1a1a';
    g.fill();
    return finishTexture(c);
  }

  roundRect(g, 12, 12, 232, 232, 24);
  g.fillStyle = color;
  g.fill();

  g.fillStyle = '#0a0a0a';
  g.textAlign = 'center';
  g.textBaseline = 'middle';

  if (kind === 'submit') {
    g.font = 'bold 38px sans-serif';
    g.fillText('PLACE', 128, 110);
    g.fillText('ORDER', 128, 150);
    return finishTexture(c);
  }

  const lines = wrapText(g, name, 200, 'bold 30px sans-serif');
  g.font = 'bold 30px sans-serif';
  const lineH = 36;
  const startY = 116 - ((lines.length - 1) * lineH) / 2;
  lines.forEach((line, i) => g.fillText(line, 128, startY + i * lineH));

  if (price > 0) {
    g.font = '600 24px sans-serif';
    g.fillText(`$${price.toFixed(2)}`, 128, 200);
  }

  return finishTexture(c);
}

function finishTexture(canvas) {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y,     x + w, y + h, r);
  g.arcTo(x + w, y + h, x,     y + h, r);
  g.arcTo(x,     y + h, x,     y,     r);
  g.arcTo(x,     y,     x + w, y,     r);
  g.closePath();
}

function wrapText(g, text, maxWidth, font) {
  g.font = font;
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (g.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}
