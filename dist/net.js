import { Shape } from "./shape";
export class Net {
    constructor(shapeHeight, levelMapArr, levelMapImage) {
        this.shapeHeight = shapeHeight;
        this.shapes = [];
        this.buildNet(levelMapArr);
        this.sprite = levelMapImage;
    }
    drw(sketch, displayData) {
        return this.drwshp(sketch, displayData);
    }
    drwshp(sketch, displayData) {
        //draw Map Sprite
        sketch.image(this.sprite, 0, 0);
        //draw all the cells
        for (let row of this.shapes) {
            for (let shp of row) {
                shp.drw(sketch, displayData);
            }
        }
    }
    buildNet(levelMapArr) {
        let initialX = this.shapeHeight - 8;
        let initialY = this.shapeHeight * 2 / 3 + 42;
        let posX = initialX;
        let posY = initialY;
        //let shapePerRow = levelMapArr[0].length
        //let shapePerCol = levelMapArr.length
        for (let i = 0; i < levelMapArr[0].length; i++) {
            let colOfShapes = [];
            let rotation = 0;
            let thisX = posX;
            for (let j = 0; j < levelMapArr.length; j++) {
                let cellType = levelMapArr[j][i];
                let cell = new Shape(this.shapeHeight, thisX, posY, rotation, cellType);
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
    }
    linkNeighborCells() {
        let offRowIndecies = [0]; //[-0, 1]
        let sameRowIndecies = [-1, 1]; //[-2, -1, 1, 2]
        let onRowIndecies = [0]; //[-1, 0] //[-2, -1, 0, 1, 2]
        for (let j = 0; j < this.shapes.length; j++) {
            for (let i = 0; i < this.shapes[j].length; i++) {
                let indexShape = this.shapes[j][i];
                for (let tj = -1; tj < 2; tj++) {
                    if (tj == 0) {
                        for (let ti of sameRowIndecies) {
                            if (this.checkShapeExists(i + ti, j + tj))
                                indexShape.neighbors.push(this.shapes[j + tj][i + ti]);
                        }
                    }
                    else {
                        if (j % 2 == 0) {
                            for (let ti of onRowIndecies) {
                                if (this.checkShapeExists(i + ti, j + tj))
                                    indexShape.neighbors.push(this.shapes[j + tj][i + ti]);
                            }
                        }
                        else {
                            for (let ti of offRowIndecies) {
                                if (this.checkShapeExists(i + ti, j + tj))
                                    indexShape.neighbors.push(this.shapes[j + tj][i + ti]);
                            }
                        }
                    }
                }
            }
        }
        this.findDistToSafeAllTiles();
    }
    checkShapeExists(col, row) {
        //console.log(`col: ${col}, row: ${row}`)
        let tooHigh = row < 0;
        let tooLow = row >= this.shapes.length;
        let tooLeft = col < 0;
        let tooRight = false;
        if (!tooLow && !tooHigh)
            tooRight = col >= this.shapes[row].length;
        return !tooLeft && !tooRight && !tooHigh && !tooLow;
    }
    clickAt(sketch) {
        let mx = sketch.mouseX;
        let my = sketch.mouseY;
        //console.log(`mx: ${mx}, my: ${my}`)
        if (mx < 0 || my < 0 || mx > sketch.width || my > sketch.height)
            return;
        let lowestDist;
        let closestCell;
        for (let r of this.shapes) {
            for (let cell of r) {
                let distance = sketch.dist(mx, my, cell.center.x, cell.center.y);
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
    }
    findDistToSafeAllTiles() {
        let safeTiles = [];
        for (let j = 0; j < this.shapes.length; j++) {
            for (let i = 0; i < this.shapes[j].length; i++) {
                if (this.shapes[j][i].type == 2)
                    safeTiles.push(this.shapes[j][i]);
            }
        }
        for (let safeTile of safeTiles) {
            safeTile.distToSafe = 0;
            this.propogateSafeDistance(safeTile);
        }
    }
    propogateSafeDistance(tile) {
        for (let n of tile.neighbors) {
            if (n.type != 5) {
                if (n.distToSafe == null || n.distToSafe > tile.distToSafe + 1) {
                    n.distToSafe = tile.distToSafe + 1;
                    this.propogateSafeDistance(n);
                }
            }
        }
    }
    columnLabel(columnIndex) {
        let remainingNum = columnIndex;
        let colIndecies = [];
        //break down number into a base 26 number
        do {
            colIndecies.unshift(remainingNum % 26);
            remainingNum -= remainingNum % 26;
            remainingNum /= 26;
        } while (remainingNum != 0);
        colIndecies[colIndecies.length - 1]++;
        //convert base 26 number to letters
        let label = "";
        for (let c of colIndecies) {
            //if(num < 26) colIndecies[0]++
            label += String.fromCharCode(64 + c);
        }
        return label;
    }
    get trainerSpawnSpace() {
        return this.spacesOfType(3)[0];
    }
    get playerSpawnSpace() {
        return this.spacesOfType(4)[0];
    }
    spacesOfType(type) {
        let matchingSpaces = [];
        for (let j = 0; j < this.shapes.length; j++) {
            for (let i = 0; i < this.shapes[j].length; i++) {
                if (this.shapes[j][i].type === type)
                    matchingSpaces.push(this.shapes[j][i]);
            }
        }
        return matchingSpaces;
    }
    clearSelected() {
        for (let row of this.shapes) {
            for (let shp of row) {
                shp.selected = false;
            }
        }
    }
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
    withinTwoMovement(firstTile, secondTile) {
        for (let n1 of firstTile.neighbors.filter((n) => n.type != 5)) {
            if (n1 == secondTile)
                return true;
            for (let n2 of secondTile.neighbors.filter((n) => n.type != 5)) {
                if (n1 == n2)
                    return true;
            }
        }
        return false;
    }
}
