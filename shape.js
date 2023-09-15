"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
var p5_1 = require("p5");
//import * as p5 from 'p5'
var Shape = /** @class */ (function () {
    function Shape(shapeHeight, xCenter, yCenter, angle, type) {
        this.shapeHeight = shapeHeight;
        this.center = new p5_1.Vector(xCenter, yCenter);
        this.angle = angle + Math.PI / 4;
        this.type = type;
        this.r = shapeHeight * Math.sqrt(2) / 2;
        this.pointCount = 4;
        this.points = [];
        for (var pI = 0; pI < this.pointCount; pI++) {
            this.points.push(new p5_1.Vector(this.r * Math.cos(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.x, this.r * Math.sin(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.y));
        }
        this.highlightPoints = [];
        for (var pI = 0; pI < this.pointCount; pI++) {
            this.highlightPoints.push(new p5_1.Vector((this.r - 2) * Math.cos(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.x, (this.r - 2) * Math.sin(this.angle + (pI / this.pointCount) * 2 * Math.PI) + this.center.y));
        }
        this.neighbors = [];
        this.distToSafe = 9999999; //This is bad but better than assigning null?
        this.column = "";
        this.row = "";
        this.actors = [];
        this.selected = false;
    }
    Shape.prototype.drw = function (sketch, displayData) {
        return this.drwshp(sketch, displayData);
    };
    Shape.prototype.drwshp = function (sketch, displayData) {
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
            for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                var p = _a[_i];
                sketch.vertex(p.x, p.y);
            }
            sketch.endShape("close");
        }
        if (this.selected) {
            sketch.stroke('yellow');
            sketch.strokeWeight(2);
            sketch.beginShape();
            for (var _b = 0, _c = this.highlightPoints; _b < _c.length; _b++) {
                var p = _c[_b];
                sketch.vertex(p.x, p.y);
            }
            sketch.endShape("close");
        }
        //find Sprite Centers
        var visibleSprites = this.actors.filter(function (spr) { return spr.visible; });
        var visibleSpriteCount = visibleSprites.length;
        var spriteCenters = [];
        if (visibleSpriteCount == 1 && !displayData.showLabels) {
            spriteCenters.push(new p5_1.Vector(this.center.x, this.center.y));
        }
        else {
            for (var pI = 0; pI < visibleSpriteCount; pI++) {
                var spriteOffset = 1;
                if (displayData.showLabels)
                    spriteOffset = 1.25;
                spriteCenters.push(new p5_1.Vector(this.r * spriteOffset * Math.cos(this.angle - Math.PI / 3 + (pI / visibleSpriteCount) * 2 * Math.PI) / 2 + this.center.x, this.r * spriteOffset * Math.sin(this.angle - Math.PI / 3 + (pI / visibleSpriteCount) * 2 * Math.PI) / 2 + this.center.y));
            }
        }
        //place Sprites at spriteCenters
        for (var sIndex in visibleSprites) {
            var s = visibleSprites[sIndex];
            var spriteScaleFactor = 1;
            if (displayData.showLabels)
                spriteScaleFactor = 0.7;
            var newSprite = s.sprite.get();
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
    };
    Object.defineProperty(Shape.prototype, "label", {
        get: function () {
            return this.makeLabel();
        },
        enumerable: false,
        configurable: true
    });
    Shape.prototype.makeLabel = function () {
        return this.column + this.row;
    };
    return Shape;
}());
exports.Shape = Shape;
