export function point(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.arc(x, y, 1, 0, 2 * Math.PI);
  ctx.stroke();
}

export function randomInt(num: number, max: number | null = null) {
  if (max) return Math.floor(Math.random() * (max - num + 1)) + num;
  else return Math.floor(Math.random() * num) + 1;
}
export function randomFloat(num: number, max: number | null = null) {
  if (max) return Math.random() * (max - num + 1) + num;
  else return Math.random() * num;
}

export function showFps(ctx: CanvasRenderingContext2D, fps: number) {
  ctx.fillText(`FPS: ${Math.floor(1000 / fps)}`, 10, 30);
}

function gaussianRand() {
  var rand = 0;
  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }
  return rand / 6;
}

export function randomGaussian(start = 0, end = 1) {
  return Math.floor(start + gaussianRand() * (end - start + 1));
}
