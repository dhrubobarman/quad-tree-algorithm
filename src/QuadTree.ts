import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { point, randomGaussian, randomInt } from "./helperFunctions";

export class QuadTree {
  boundry: Rectangle;
  capacity: number;
  points: Point[];
  topRight: QuadTree | null;
  topLeft: QuadTree | null;
  bottomRight: QuadTree | null;
  bottomLeft: QuadTree | null;
  devided: boolean;
  isMousePressed: boolean;
  maxPoints: number;
  distributionAlgo: "gaussian" | "uniform";
  canvas: HTMLCanvasElement;

  constructor(
    boundry: Rectangle,
    n: number = 4,
    maxPoints = 100,
    canvas: HTMLCanvasElement
  ) {
    this.boundry = boundry;
    this.capacity = n;
    this.points = [];
    this.devided = false;
    this.topRight = null;
    this.topLeft = null;
    this.bottomRight = null;
    this.bottomLeft = null;
    this.isMousePressed = false;
    this.maxPoints = maxPoints;
    this.distributionAlgo = "uniform";
    this.canvas = canvas;
    this._createPoints();
  }

  subdivide() {
    const { x, y, w, h } = this.boundry;
    const tr = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    const tl = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    const br = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    const bl = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);

    this.topRight = new QuadTree(
      tr,
      this.capacity,
      this.maxPoints,
      this.canvas
    );
    this.topLeft = new QuadTree(tl, this.capacity, this.maxPoints, this.canvas);
    this.bottomRight = new QuadTree(
      br,
      this.capacity,
      this.maxPoints,
      this.canvas
    );
    this.bottomLeft = new QuadTree(
      bl,
      this.capacity,
      this.maxPoints,
      this.canvas
    );
    this.devided = true;
  }

  insert(point: Point) {
    if (!this.boundry.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.devided) {
        this.subdivide();
      }
      if (
        this.topRight?.insert(point) ||
        this.topLeft?.insert(point) ||
        this.bottomRight?.insert(point) ||
        this.bottomLeft?.insert(point)
      ) {
        return true;
      }
    }
  }

  query(range: Rectangle): Point[] {
    const pointsInRange: Point[] = [];
    if (!this.boundry.intersects(range)) {
      return [];
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          pointsInRange.push(p);
        }
      }
    }
    if (this.devided) {
      return pointsInRange.concat(
        this.topRight?.query(range) || [],
        this.topLeft?.query(range) || [],
        this.bottomRight?.query(range) || [],
        this.bottomLeft?.query(range) || []
      );
    }
    return pointsInRange;
  }

  // extra methods for visualization
  changeMaxPoints(maxPoints: number) {
    this.maxPoints = maxPoints;
    this.reset();
    this._createPoints();
  }

  changeDistributionAlgo(algo: "gaussian" | "uniform") {
    this.distributionAlgo = algo;
    this.reset();
    this._createPoints();
  }

  private _createPoints() {
    if (this.distributionAlgo === "gaussian") {
      for (let i = 0; i < this.maxPoints; i++) {
        const p = new Point(
          randomGaussian(this.canvas.width / 2, this.canvas.height / 10),
          randomGaussian(this.canvas.width / 2, this.canvas.height / 10)
        );
        this.insert(p);
      }
    } else {
      for (let i = 0; i < this.maxPoints; i++) {
        const p = new Point(
          randomInt(this.canvas.width),
          randomInt(this.canvas.height)
        );
        this.insert(p);
      }
    }
  }

  reset() {
    this.points = [];
    this.devided = false;
    this.topRight = null;
    this.topLeft = null;
    this.bottomRight = null;
    this.bottomLeft = null;
    return;
  }

  show(
    ctx: CanvasRenderingContext2D,
    line: boolean = true,
    points: boolean = true
  ) {
    if (line) {
      ctx.beginPath();
      ctx.rect(
        this.boundry.x - this.boundry.w,
        this.boundry.y - this.boundry.h,
        this.boundry.w * 2,
        this.boundry.h * 2
      );
      ctx.stroke();
    }
    if (points) {
      for (let p of this.points) {
        point(ctx, p.x, p.y);
      }
    }
    if (this.devided) {
      this.topRight?.show(ctx, line, points);
      this.topLeft?.show(ctx, line, points);
      this.bottomRight?.show(ctx, line, points);
      this.bottomLeft?.show(ctx, line, points);
    }
  }
}
