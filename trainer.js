"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer = void 0;
const actor_1 = require("./actor");
class Trainer extends actor_1.Actor {
    constructor(startingTile, sprite, spritePath) {
        super(startingTile, sprite, spritePath);
        this.timesStealthed = 0;
        this.progress = 0;
    }
    get takeTurn() {
        let nextTile = this.determineNextMove;
        if (nextTile)
            this.move(nextTile);
        //make Noise
        return this.makeNoise();
    }
    get determineNextMove() {
        let closerTiles = [];
        let sameDistTiles = [];
        let backStepTiles = [];
        //place all tiles into the appropiate array based on thier distance to the end
        for (let n of this.tile.neighbors) {
            if (this.tile.distToSafe > n.distToSafe && n.type != 5)
                closerTiles.push(n);
            if (this.tile.distToSafe == n.distToSafe && n.type != 5)
                sameDistTiles.push(n);
            if (this.tile.distToSafe < n.distToSafe && n.type != 5)
                backStepTiles.push(n);
        }
        let forwardPossible = closerTiles.length > 0;
        let strafePossible = sameDistTiles.length > 0;
        let backwardsPossible = backStepTiles.length > 0;
        //change this Trainers tile
        let roll = Math.floor(Math.random() * 10) - this.progress;
        let intent;
        if (roll > 0) {
            intent = "Forward";
        }
        else if (roll > -2) {
            intent = "Strafe";
        }
        else {
            intent = "Backward";
        }
        let direction;
        switch (intent) {
            case "Backward":
                if (backwardsPossible) {
                    direction = "Backward";
                }
                else if (strafePossible) {
                    direction = "Strafe";
                }
                else {
                    direction = "Forward";
                }
                break;
            case "Strafe":
                if (strafePossible) {
                    direction = "Strafe";
                }
                else if (backwardsPossible) {
                    direction = "Backward";
                }
                else {
                    direction = "Forward";
                }
                break;
            case "Forward":
                if (forwardPossible) {
                    direction = "Forward";
                }
                else if (strafePossible) {
                    direction = "Strafe";
                }
                else {
                    direction = "Backward";
                }
                break;
        }
        console.log(`Trainer rolled a ${roll + this.progress}, minus progress of ${this.progress}, gives an intent of ${intent}, 
  the direction becomes ${direction}`);
        if (direction == "Forward") {
            this.progress++;
            return closerTiles[Math.floor(Math.random() * closerTiles.length)];
        }
        if (direction == "Strafe")
            return sameDistTiles[Math.floor(Math.random() * sameDistTiles.length)];
        if (direction == "Backward") {
            this.progress = 0;
            return backStepTiles[Math.floor(Math.random() * backStepTiles.length)];
        }
        //If no direction can be found (only if there are no neighbors)
        return null;
    }
    makeNoise() {
        let tileType = "";
        switch (this.tile.type) {
            case 0: {
                tileType = `Water`;
                break;
            }
            case 2: {
                tileType = `Escaped`;
                break;
            }
            default: {
                let roll = Math.floor(Math.random() * 10);
                //console.log(`roll ${roll}`)
                if (roll + this.timesStealthed > 7) {
                    this.timesStealthed = -2;
                    tileType = `${this.tile.label}`;
                }
                else {
                    this.timesStealthed++;
                    tileType = `Rocky`;
                }
                break;
            }
        }
        return tileType;
    }
}
exports.Trainer = Trainer;
