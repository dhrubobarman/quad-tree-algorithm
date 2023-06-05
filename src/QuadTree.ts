import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { point } from "./helperFunctions";

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

  constructor(boundry: Rectangle, n: number = 4) {
    this.boundry = boundry;
    this.capacity = n;
    this.points = [];
    this.devided = false;
    this.topRight = null;
    this.topLeft = null;
    this.bottomRight = null;
    this.bottomLeft = null;
    this.isMousePressed = false;
  }

  subdivide() {
    const { x, y, w, h } = this.boundry;
    const tr = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    const tl = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    const br = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    const bl = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);

    this.topRight = new QuadTree(tr, this.capacity);
    this.topLeft = new QuadTree(tl, this.capacity);
    this.bottomRight = new QuadTree(br, this.capacity);
    this.bottomLeft = new QuadTree(bl, this.capacity);
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
