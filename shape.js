<<<<<<< HEAD
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
const p5_1 = require("p5");
//import * as p5 from 'p5'
class Shape {
    constructor(shapeHeight, xCenter, yCenter, angle, type) {
        this.shapeHeight = shapeHeight;
        this.center = new p5_1.Vector(xCenter, yCenter);
        this.angle = angle + Math.PI / 4;
        this.type = type;
        this.r = shapeHeight * Math.sqrt(2) / 2;
        this.pointCount = 4;
        this.points = [];
        for (let pI = 0; pI < this.pointCount; pI++) {
            this.points.push(new p5_1.Vector(this.r * Math.cos(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.x, this.r * Math.sin(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.y));
        }
        this.highlightPoints = [];
        for (let pI = 0; pI < this.pointCount; pI++) {
            this.highlightPoints.push(new p5_1.Vector((this.r - 2) * Math.cos(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.x, (this.r - 2) * Math.sin(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.y));
        }
        this.neighbors = [];
        this.distToSafe = null;
        this.column = "";
        this.row = "";
        this.actors = [];
        this.selected = false;
    }
    drw(sketch, displayData) {
        return this.drwshp(sketch, displayData);
    }
    drwshp(sketch, displayData) {
        sketch.noFill();
        sketch.stroke(220);
        sketch.strokeWeight(1);
        if (displayData.showColorTypes) {
            if (this.type == 0)
                sketch.fill(0, 0, 250, displayData.tileColorOpacity); // const QUIET_SPACE = 0
            if (this.type == 5)
                sketch.fill(20, 20, 20, displayData.tileColorOpacity); // const NOISY_SPACE = 1
            if (this.type == 2)
                sketch.fill(0, 250, 0, displayData.tileColorOpacity); // const SAFE_SPACE = 2
            if (this.type == 3)
                sketch.fill(250, 150, 0, displayData.tileColorOpacity); // const PLAYER_SPAWN = 3
            if (this.type == 4)
                sketch.fill(250, 0, 250, displayData.tileColorOpacity); // const PREY_SPAWN = 4
        }
        if (this.type == 5)
            sketch.noStroke();
        if (!displayData.colorTileOutlines)
            sketch.noStroke();
        if (displayData.colorTileOutlines || displayData.showColorTypes) {
            sketch.beginShape();
            for (let p of this.points) {
                sketch.vertex(p.x, p.y);
            }
            sketch.endShape("close");
        }
        if (this.selected) {
            sketch.stroke('yellow');
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
            spriteCenters.push(new p5_1.Vector(this.center.x, this.center.y));
        }
        else {
            for (let pI = 0; pI < visibleSpriteCount; pI++) {
                let spriteOffset = 1;
                if (displayData.showLabels)
                    spriteOffset = 1.25;
                spriteCenters.push(new p5_1.Vector(this.r * spriteOffset * Math.cos(this.angle - Math.PI / 3 + (pI / visibleSpriteCount) * 2 * Math.PI) / 2 + this.center.x, this.r * spriteOffset * Math.sin(this.angle - Math.PI / 3 + (pI / visibleSpriteCount) * 2 * Math.PI) / 2 + this.center.y));
            }
        }
        //place Sprites at spriteCenters
        for (let sIndex in visibleSprites) {
            let s = visibleSprites[sIndex];
            let spriteScaleFactor = 1;
            if (displayData.showLabels)
                spriteScaleFactor = 0.7;
            let newSprite = s.sprite.get();
            newSprite.resize(0, this.shapeHeight * 0.8 / Math.sqrt(visibleSpriteCount) * spriteScaleFactor);
            sketch.image(newSprite, spriteCenters[sIndex].x - newSprite.width / 2, spriteCenters[sIndex].y - newSprite.height / 2);
        }
        if (displayData.showLabels && this.type != 5) {
            sketch.strokeWeight(1);
            sketch.noStroke();
            //if(this.selected) stroke('yellow')
            sketch.fill('white');
            // if(this.type == 1 || this.type == 4 || this.type == 3) {
            //   fill('white')
            // } else {
            //   fill('black')
            // }
            sketch.textSize(this.shapeHeight / 3);
            sketch.text(this.label, this.center.x - this.shapeHeight / 6, this.center.y + this.shapeHeight / 12);
        }
    }
    get label() {
        return this.makeLabel();
    }
    makeLabel() {
        return this.column + this.row;
    }
}
exports.Shape = Shape;
=======
class shape{
  constructor(shapeHeight, xCenter, yCenter, angle, type){
    this.shapeHeight = shapeHeight;
    this.center = createVector(xCenter, yCenter)
    this.angle = angle + PI / 4;
    this.type = type
    // this.side = shapeHeight*1.1547;
    this.r = shapeHeight * Math.sqrt(2) / 2
    
    this.pointCount = 4
    
    this.points = []
    
    for(let pI = 0; pI<this.pointCount; pI++){
      this.points.push(createVector(
        this.r * cos(this.angle + (pI/this.pointCount) * 2 * PI) + this.center.x,
        this.r * sin(this.angle + (pI/this.pointCount) * 2 * PI) + this.center.y
      ))
    }    
    
    this.highlightPoints = []
    
    for(let pI = 0; pI<this.pointCount; pI++){
      this.highlightPoints.push(createVector(
        (this.r - 2) * cos(this.angle + (pI/this.pointCount) * 2 * PI) + this.center.x,
        (this.r - 2) * sin(this.angle + (pI/this.pointCount) * 2 * PI) + this.center.y
      ))
    }
    
    this.neighbors = []
    this.distToSafe = null
    this.column = ""
    this.row = ""
    this.sprites = []
    this.selected = false
  }
  
  drw(displayData){
    return this.drwshp(displayData);
  }
  
  drwshp(displayData){
    noFill();
    stroke(220);
    strokeWeight(1)
    if(displayData.showColorTypes) {
      if(this.type == 0) fill(0, 0, 250, displayData.tileColorOpacity);    // const QUIET_SPACE = 0
      if(this.type == 5) fill(20, 20, 20, displayData.tileColorOpacity);    // const NOISY_SPACE = 1
      if(this.type == 2) fill(0, 250, 0, displayData.tileColorOpacity);    // const SAFE_SPACE = 2
      if(this.type == 3) fill(250, 150, 0, displayData.tileColorOpacity);    // const PLAYER_SPAWN = 3
      if(this.type == 4) fill(250, 0, 250, displayData.tileColorOpacity);    // const PREY_SPAWN = 4
    }
    // noFill()
    if(this.type == 5) noStroke()          // const NULL_SPACE = 5
    
    if(!displayData.colorTileOutlines) noStroke()

    if(displayData.colorTileOutlines || displayData.showColorTypes){
      beginShape();
      for(let p of this.points){
        vertex(p.x, p.y)
      }
      endShape(CLOSE);
    }
    
    if(this.selected) {
      stroke('yellow')
      strokeWeight(2)
      beginShape();
      for(let p of this.highlightPoints){
        vertex(p.x, p.y)
      }
      endShape(CLOSE);
    }
    
    //find Sprite Centers
    let visibleSprites = this.sprites.filter((spr) => spr.visible)
    let visibleSpriteCount = visibleSprites.length
    let spriteCenters = []
    if(visibleSpriteCount == 1 && !displayData.showLabels) {
      spriteCenters.push(createVector(this.center.x, this.center.y))
    } else {
      for(let pI = 0; pI<visibleSpriteCount; pI++){
        let spriteOffset = 1
        if(displayData.showLabels) spriteOffset = 1.25
        spriteCenters.push(createVector(
          this.r * spriteOffset * cos(this.angle - PI/3 + (pI/visibleSpriteCount) * 2 * PI) / 2 + this.center.x,
          this.r * spriteOffset * sin(this.angle - PI/3 + (pI/visibleSpriteCount) * 2 * PI) / 2 + this.center.y
        ))
      }
    }
    
    //place Sprites at spriteCenters
    for(let sIndex in visibleSprites){
      let s = visibleSprites[sIndex]
      let spriteScaleFactor = 1
      if(displayData.showLabels) spriteScaleFactor = 0.7
      let newSprite = s.sprite.get()
      newSprite.resize(0, this.shapeHeight * 0.8 / Math.sqrt(visibleSpriteCount) * spriteScaleFactor)
      image(newSprite, spriteCenters[sIndex].x - newSprite.width/2, spriteCenters[sIndex].y - newSprite.height/2)
    }
    
    if(displayData.showLabels && this.type != 5) {
      strokeWeight(1)
      noStroke()
      //if(this.selected) stroke('yellow')
      fill('white')
      // if(this.type == 1 || this.type == 4 || this.type == 3) {
      //   fill('white')
      // } else {
      //   fill('black')
      // }
      textSize(this.shapeHeight / 3);
      text(this.label, this.center.x-this.shapeHeight / 6, this.center.y + this.shapeHeight / 12);
    }
    
    
  }
  
  get label(){
    return this.makeLabel();
  }
  
  makeLabel(){
    return this.column + this.row
  }
}
>>>>>>> main
