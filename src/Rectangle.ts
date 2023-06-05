import type { Point } from "./types";

export class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
  }
  contains(point: Point) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    );
  }
  intersects(rect: Rectangle) {
    return !(
      rect.x - rect.w > this.x + this.w ||
      rect.x + rect.w < this.x - this.w ||
      rect.y - rect.h > this.y + this.h ||
      rect.y + rect.h < this.y - this.h
    );
  }

  show(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement | null = null,
    mouse = false
  ) {
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.strokeRect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
    ctx.restore();
    if (mouse && canvas) {
      canvas.addEventListener("mousemove", (e) => {
        this.x = e.offsetX;
        this.y = e.offsetY;
      });
    }
  }
}
