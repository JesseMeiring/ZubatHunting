"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Net = void 0;
var shape_1 = require("./shape");
var Net = /** @class */ (function () {
    function Net(shapeHeight, levelMapArr, levelMapImage) {
        this.shapeHeight = shapeHeight;
        this.shapes = [];
        this.buildNet(levelMapArr);
        this.sprite = levelMapImage;
    }
    Net.prototype.drw = function (sketch, displayData) {
        return this.drwshp(sketch, displayData);
    };
    Net.prototype.drwshp = function (sketch, displayData) {
        //draw Map Sprite
        sketch.image(this.sprite, 0, 0);
        //draw all the cells
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var shp = row_1[_b];
                shp.drw(sketch, displayData);
            }
        }
    };
    Net.prototype.buildNet = function (levelMapArr) {
        var initialX = this.shapeHeight - 8;
        var initialY = this.shapeHeight * 2 / 3 + 42;
        var posX = initialX;
        var posY = initialY;
        //let shapePerRow = levelMapArr[0].length
        //let shapePerCol = levelMapArr.length
        for (var i = 0; i < levelMapArr[0].length; i++) {
            var colOfShapes = [];
            var rotation = 0;
            var thisX = posX;
            for (var j = 0; j < levelMapArr.length; j++) {
                var cellType = levelMapArr[j][i];
                var cell = new shape_1.Shape(this.shapeHeight, thisX, posY, rotation, cellType);
                cell.column = this.columnLabel(i);
                cell.row = (j + 1).toString();
                colOfShapes.push(cell);
                posY += this.shapeHeight; // / 0.866
            }
            this.shapes.push(colOfShapes);
            posX += this.shapeHeight * 1;
            //initialY = this.shapeHeight / 0.866 / 2
            posY = initialY;
            //offset even columns for Hex/Triangle grids
            //if(i % 2 == 0) posY += this.shapeHeight / 2 / 0.866
        }
        this.linkNeighborCells();
    };
    Net.prototype.linkNeighborCells = function () {
        var offRowIndecies = [0]; //[-0, 1]
        var sameRowIndecies = [-1, 1]; //[-2, -1, 1, 2]
        var onRowIndecies = [0]; //[-1, 0] //[-2, -1, 0, 1, 2]
        for (var j = 0; j < this.shapes.length; j++) {
            for (var i = 0; i < this.shapes[j].length; i++) {
                var indexShape = this.shapes[j][i];
                for (var tj = -1; tj < 2; tj++) {
                    if (tj == 0) {
                        for (var _i = 0, sameRowIndecies_1 = sameRowIndecies; _i < sameRowIndecies_1.length; _i++) {
                            var ti = sameRowIndecies_1[_i];
                            if (this.checkShapeExists(i + ti, j + tj))
                                indexShape.neighbors.push(this.shapes[j + tj][i + ti]);
                        }
                    }
                    else {
                        if (j % 2 == 0) {
                            for (var _a = 0, onRowIndecies_1 = onRowIndecies; _a < onRowIndecies_1.length; _a++) {
                                var ti = onRowIndecies_1[_a];
                                if (this.checkShapeExists(i + ti, j + tj))
                                    indexShape.neighbors.push(this.shapes[j + tj][i + ti]);
                            }
                        }
                        else {
                            for (var _b = 0, offRowIndecies_1 = offRowIndecies; _b < offRowIndecies_1.length; _b++) {
                                var ti = offRowIndecies_1[_b];
                                if (this.checkShapeExists(i + ti, j + tj))
                                    indexShape.neighbors.push(this.shapes[j + tj][i + ti]);
                            }
                        }
                    }
                }
            }
        }
        this.findDistToSafeAllTiles();
    };
    Net.prototype.checkShapeExists = function (col, row) {
        //console.log(`col: ${col}, row: ${row}`)
        var tooHigh = row < 0;
        var tooLow = row >= this.shapes.length;
        var tooLeft = col < 0;
        var tooRight = false;
        if (!tooLow && !tooHigh)
            tooRight = col >= this.shapes[row].length;
        return !tooLeft && !tooRight && !tooHigh && !tooLow;
    };
    Net.prototype.clickAt = function (sketch) {
        var mx = sketch.mouseX;
        var my = sketch.mouseY;
        //console.log(`mx: ${mx}, my: ${my}`)
        if (mx < 0 || my < 0 || mx > sketch.width || my > sketch.height)
            return;
        var lowestDist;
        var closestCell;
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var r = _a[_i];
            for (var _b = 0, r_1 = r; _b < r_1.length; _b++) {
                var cell = r_1[_b];
                var distance = sketch.dist(mx, my, cell.center.x, cell.center.y);
                if (!lowestDist || lowestDist > distance) {
                    lowestDist = distance;
                    closestCell = cell;
                }
            }
        }
        //if the closest distance is within half-ish a shapeheight, we can assume it's on that shape and return it
        if (lowestDist && lowestDist < this.shapeHeight / 1.6)
            return closestCell;
        //otherwise, we probably didn't click on a cell
        return null;
    };
    Net.prototype.findDistToSafeAllTiles = function () {
        var safeTiles = [];
        for (var j = 0; j < this.shapes.length; j++) {
            for (var i = 0; i < this.shapes[j].length; i++) {
                if (this.shapes[j][i].type == 2)
                    safeTiles.push(this.shapes[j][i]);
            }
        }
        for (var _i = 0, safeTiles_1 = safeTiles; _i < safeTiles_1.length; _i++) {
            var safeTile = safeTiles_1[_i];
            safeTile.distToSafe = 0;
            this.propogateSafeDistance(safeTile);
        }
    };
    Net.prototype.propogateSafeDistance = function (tile) {
        for (var _i = 0, _a = tile.neighbors; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.type != 5) {
                if (n.distToSafe == null || n.distToSafe > tile.distToSafe + 1) {
                    n.distToSafe = tile.distToSafe + 1;
                    this.propogateSafeDistance(n);
                }
            }
        }
    };
    Net.prototype.columnLabel = function (columnIndex) {
        var remainingNum = columnIndex;
        var colIndecies = [];
        //break down number into a base 26 number
        do {
            colIndecies.unshift(remainingNum % 26);
            remainingNum -= remainingNum % 26;
            remainingNum /= 26;
        } while (remainingNum != 0);
        colIndecies[colIndecies.length - 1]++;
        //convert base 26 number to letters
        var label = "";
        for (var _i = 0, colIndecies_1 = colIndecies; _i < colIndecies_1.length; _i++) {
            var c = colIndecies_1[_i];
            //if(num < 26) colIndecies[0]++
            label += String.fromCharCode(64 + c);
        }
        return label;
    };
    Object.defineProperty(Net.prototype, "trainerSpawnSpace", {
        get: function () {
            return this.spacesOfType(3)[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Net.prototype, "playerSpawnSpace", {
        get: function () {
            return this.spacesOfType(4)[0];
        },
        enumerable: false,
        configurable: true
    });
    Net.prototype.spacesOfType = function (type) {
        var matchingSpaces = [];
        for (var j = 0; j < this.shapes.length; j++) {
            for (var i = 0; i < this.shapes[j].length; i++) {
                if (this.shapes[j][i].type === type)
                    matchingSpaces.push(this.shapes[j][i]);
            }
        }
        return matchingSpaces;
    };
    Net.prototype.clearSelected = function () {
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
                var shp = row_2[_b];
                shp.selected = false;
            }
        }
    };
    //   shortestDistanceBetween(t1, t2, memo={}) {
    //     if(t1 == t2) return 0
    //     const key = t1.label + "," + t2.label
    //     if(key in memo) return memo[key]
    //     for(let n of t1.neighbors) {
    //       if(n.type != 5){
    //         //if(n.distToSafe == null || n.distToSafe > t.distToSafe + 1) {
    //           n.distToSafe = t.distToSafe + 1
    //           this.shortestDistanceBetween(n, t2)
    //         //}
    //       }
    //     }
    //   }
    Net.prototype.withinTwoMovement = function (firstTile, secondTile) {
        for (var _i = 0, _a = firstTile.neighbors.filter(function (n) { return n.type != 5; }); _i < _a.length; _i++) {
            var n1 = _a[_i];
            if (n1 == secondTile)
                return true;
            for (var _b = 0, _c = secondTile.neighbors.filter(function (n) { return n.type != 5; }); _b < _c.length; _b++) {
                var n2 = _c[_b];
                if (n1 == n2)
                    return true;
            }
        }
        return false;
    };
    return Net;
}());
exports.Net = Net;
