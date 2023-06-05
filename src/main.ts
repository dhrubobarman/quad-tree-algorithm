import "./style.css";
import { QuadTree } from "./QuadTree";
import { Rectangle } from "./Rectangle";
import { point } from "./helperFunctions";
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
const pointCount = document.querySelector("#pointCount") as HTMLInputElement;
const totalPoints = document.querySelector("#totalPoints") as HTMLSpanElement;

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
const quadTree = new QuadTree(boundry, 4, 300, canvas);

noiseAlgorithmInput.addEventListener("change", (e) => {
  const target = e.target as HTMLSelectElement;
  const value = target.value as "gaussian" | "uniform";
  quadTree.changeDistributionAlgo(value);
});
pointCount.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  const value = Number(target.value);
  totalPoints.innerHTML =
    value < 600
      ? `<span >${value}p</span>`
      : `<span style="color: red">${value}p</span>`;
  quadTree.changeMaxPoints(value);
});

const viewFinder = new Rectangle(300, 200, 50, 50);

let currentTime = 0;
function animate(time: number = 0) {
  const deltaTime = time - currentTime;
  currentTime = time;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  controlSettings(ctx, canvas, deltaTime, viewFinder);
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
  quadTree.show(ctx, subdevideLineVisible, dotsVisible);
  if (mouseControlInput.checked) {
    const points = quadTree.query(range) || [];
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
