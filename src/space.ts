/// <reference path="../typings/p5-global.d.ts" />
import type p5 from "p5";

import { Vector, Image, Graphics } from "p5";
import { Actor } from "./actor";
import { DisplayData } from "./displayData";
//import * as p5 from 'p5'

export class Space {
  spaceHeight: number;
  center: Vector;
  angle: number;
  type: number;
  r: number;
  pointCount: number;
  points: Vector[];
  highlightPoints: Vector[];
  neighbors: Space[];
  distToSafe: number;
  column: string;
  row: string;
  actors: Actor[];
  selected: boolean;

  constructor(
    shapeHeight: number,
    xCenter: number,
    yCenter: number,
    angle: number,
    type: number
  ) {
    this.spaceHeight = shapeHeight;
    this.center = new Vector(xCenter, yCenter);
    this.angle = angle + Math.PI / 4;
    this.type = type;
    this.r = (shapeHeight * Math.sqrt(2)) / 2;
    this.pointCount = 4;

    this.points = [];

    for (let pI = 0; pI < this.pointCount; pI++) {
      this.points.push(
        new Vector(
          this.r * Math.cos(this.angle + (pI / this.pointCount) * 2 * Math.PI) +
            this.center.x,
          this.r * Math.sin(this.angle + (pI / this.pointCount) * 2 * Math.PI) +
            this.center.y
        )
      );
    }

    this.highlightPoints = [];

    for (let pI = 0; pI < this.pointCount; pI++) {
      this.highlightPoints.push(
        new Vector(
          (this.r - 2) *
            Math.cos(this.angle + (pI / this.pointCount) * 2 * Math.PI) +
            this.center.x,
          (this.r - 2) *
            Math.sin(this.angle + (pI / this.pointCount) * 2 * Math.PI) +
            this.center.y
        )
      );
    }

    this.neighbors = [];
    this.distToSafe = 9999999; //This is bad but better than assigning null?
    this.column = "";
    this.row = "";
    this.actors = [];
    this.selected = false;
  }

  drw(sketch: p5, displayData: DisplayData) {
    return this.drwshp(sketch, displayData);
  }

  drwshp(sketch: p5, displayData: DisplayData) {
    sketch.noFill();
    sketch.stroke(220);
    sketch.strokeWeight(1);
    if (displayData.showColorTypes) {
      if (this.type == 0) sketch.fill(0, 0, 250, displayData.tileColorOpacity); // const QUIET_SPACE = 0
      if (this.type == 5) sketch.fill(20, 20, 20, displayData.tileColorOpacity); // const NOISY_SPACE = 1
      if (this.type == 2) sketch.fill(0, 250, 0, displayData.tileColorOpacity); // const SAFE_SPACE = 2
      if (this.type == 3)
        sketch.fill(250, 150, 0, displayData.tileColorOpacity); // const PLAYER_SPAWN = 3
      if (this.type == 4)
        sketch.fill(250, 0, 250, displayData.tileColorOpacity); // const PREY_SPAWN = 4
    }
    if (this.type == 5) sketch.noStroke();

    if (!displayData.colorTileOutlines) sketch.noStroke();

    if (displayData.colorTileOutlines || displayData.showColorTypes) {
      sketch.beginShape();
      for (let p of this.points) {
        sketch.vertex(p.x, p.y);
      }
      sketch.endShape("close");
    }

    if (this.selected) {
      sketch.stroke("yellow");
      sketch.strokeWeight(2);
      sketch.beginShape();
      for (let p of this.highlightPoints) {
        sketch.vertex(p.x, p.y);
      }
      sketch.endShape("close");
    }

    //find Sprite Centers
    let visibleSprites = this.actors.filter((spr) => spr.visible);
    let visibleSpriteCount = visibleSprites.length;
    let spriteCenters = [];
    if (visibleSpriteCount == 1 && !displayData.showLabels) {
      spriteCenters.push(new Vector(this.center.x, this.center.y));
    } else {
      for (let pI = 0; pI < visibleSpriteCount; pI++) {
        let spriteOffset = 1;
        if (displayData.showLabels) spriteOffset = 1.25;
        spriteCenters.push(
          new Vector(
            (this.r *
              spriteOffset *
              Math.cos(
                this.angle -
                  Math.PI / 3 +
                  (pI / visibleSpriteCount) * 2 * Math.PI
              )) /
              2 +
              this.center.x,
            (this.r *
              spriteOffset *
              Math.sin(
                this.angle -
                  Math.PI / 3 +
                  (pI / visibleSpriteCount) * 2 * Math.PI
              )) /
              2 +
              this.center.y
          )
        );
      }
    }

    //place Sprites at spriteCenters
    for (let sIndex in visibleSprites) {
      let s = visibleSprites[sIndex];
      let spriteScaleFactor = 1;
      if (displayData.showLabels) spriteScaleFactor = 0.7;
      let newSprite = s.sprite.get();
      newSprite.resize(
        0,
        ((this.spaceHeight * 0.8) / Math.sqrt(visibleSpriteCount)) *
          spriteScaleFactor
      );
      sketch.image(
        newSprite,
        spriteCenters[sIndex].x - newSprite.width / 2,
        spriteCenters[sIndex].y - newSprite.height / 2
      );
    }

    if (displayData.showLabels && this.type != 5) {
      sketch.strokeWeight(1);
      sketch.noStroke();
      //if(this.selected) stroke('yellow')
      sketch.fill("white");
      // if(this.type == 1 || this.type == 4 || this.type == 3) {
      //   fill('white')
      // } else {
      //   fill('black')
      // }
      sketch.textSize(this.spaceHeight / 3);
      sketch.text(
        this.label,
        this.center.x - this.spaceHeight / 6,
        this.center.y + this.spaceHeight / 12
      );
    }
  }

  get label() {
    return this.makeLabel();
  }

  makeLabel() {
    return this.column + this.row;
  }
}
