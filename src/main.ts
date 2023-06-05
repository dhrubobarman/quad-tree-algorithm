import "./style.css";
import { QuadTree } from "./QuadTree";
import { Rectangle } from "./Rectangle";
import { point, randomGaussian, randomInt } from "./helperFunctions";
import { Point } from "./Point";
import { showFps } from "./helperFunctions";

// Controls
const mouseControlInput = document.querySelector(
  "#mouseControlInput"
) as HTMLInputElement;
const showPointsInput = document.querySelector(
  "#showPointsInput"
) as HTMLInputElement;
const showSubdevidedLinesInput = document.querySelector(
  "#showSubdevidedLinesInput"
) as HTMLInputElement;
const showFPSInput = document.querySelector(
  "#showFPSInput"
) as HTMLInputElement;
const noiseAlgorithmInput = document.querySelector(
  "#noiseAlgo"
) as HTMLSelectElement;

// Canvas setup
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.font = "30px Arial";

const boundry = new Rectangle(
  canvas.width * 0.5,
  canvas.height * 0.5,
  canvas.width * 0.5,
  canvas.height * 0.5
);
let qt = new QuadTree(boundry, 4);

for (let i = 0; i < 100; i++) {
  const p = new Point(
    randomGaussian(canvas.width / 2, canvas.height / 10),
    randomGaussian(canvas.width / 2, canvas.height / 10)
  );
  qt.insert(p);
}

noiseAlgorithmInput.addEventListener("change", (e) => {
  qt = new QuadTree(boundry, 4);
  const target = e.target as HTMLSelectElement;
  const value = target.value;
  if (value === "gaussian") {
    for (let i = 0; i < 100; i++) {
      const p = new Point(
        randomGaussian(canvas.width / 2, canvas.height / 10),
        randomGaussian(canvas.width / 2, canvas.height / 10)
      );
      qt.insert(p);
    }
  } else {
    for (let i = 0; i < 100; i++) {
      const p = new Point(randomInt(canvas.width), randomInt(canvas.height));
      qt.insert(p);
    }
  }
});

const range = new Rectangle(300, 200, 50, 50);

let currentTime = 0;
function animate(time: number = 0) {
  const deltaTime = time - currentTime;
  currentTime = time;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  controlSettings(ctx, canvas, deltaTime, range);
  requestAnimationFrame(animate);
}
animate();

function controlSettings(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  deltaTime: number,
  range: Rectangle
) {
  let subdevideLineVisible = true;
  let dotsVisible = true;

  if (showFPSInput.checked) {
    showFps(ctx, deltaTime);
  }

  if (showPointsInput.checked) {
    dotsVisible = true;
  } else {
    dotsVisible = false;
  }

  if (showSubdevidedLinesInput.checked) {
    subdevideLineVisible = true;
  } else {
    subdevideLineVisible = false;
  }
  qt.show(ctx, subdevideLineVisible, dotsVisible);
  if (mouseControlInput.checked) {
    const points = qt.query(range) || [{ x: 0, y: 0 }];

    for (let i = 0; i < points.length; i++) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 10;
      point(ctx, points[i].x, points[i].y);
      ctx.restore();
    }
    range.show(ctx, canvas, true);
  }
}
