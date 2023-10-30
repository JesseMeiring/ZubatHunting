import { Actor } from "./actor";
import { Image } from "p5";
import { Space } from "./space";
import { spaceTypes } from "./spaceTypes";

export class Trainer extends Actor {
  timesStealthed: number;
  progress: number;

  constructor(startingTile: Space, sprite: Image, spritePath: String) {
    super(startingTile, sprite, spritePath, "Trainer");

    this.timesStealthed = 0;
    this.progress = 0;
    this.visible = false;
  }

  get takeTurn() {
    let nextTile = this.determineNextMove;
    if (nextTile) this.move(nextTile);

    //make Noise
    return this.makeNoise();
  }

  get determineNextMove() {
    let closerTiles = [];
    let sameDistTiles = [];
    let backStepTiles = [];

    //place all tiles into the appropiate array based on thier distance to the end
    for (let n of this.tile.neighbors) {
      if (this.tile.distToSafe > n.distToSafe && this.spaceSafeToMoveTo(n))
        closerTiles.push(n);
      if (this.tile.distToSafe == n.distToSafe && this.spaceSafeToMoveTo(n))
        sameDistTiles.push(n);
      if (this.tile.distToSafe < n.distToSafe && this.spaceSafeToMoveTo(n))
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
    } else if (roll > -2) {
      intent = "Strafe";
    } else {
      intent = "Backward";
    }

    let direction;
    switch (intent) {
      case "Backward":
        if (backwardsPossible) {
          direction = "Backward";
        } else if (strafePossible) {
          direction = "Strafe";
        } else {
          direction = "Forward";
        }
        break;
      case "Strafe":
        if (strafePossible) {
          direction = "Strafe";
        } else if (backwardsPossible) {
          direction = "Backward";
        } else {
          direction = "Forward";
        }
        break;
      case "Forward":
        if (forwardPossible) {
          direction = "Forward";
        } else if (strafePossible) {
          direction = "Strafe";
        } else {
          direction = "Backward";
        }
        break;
    }

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

  spaceSafeToMoveTo(s: Space) {
    if (s.type === spaceTypes.EMPTY) return false;
    if (s.type === spaceTypes.SAFE) return true;
    if (s.actors.filter((e) => e.type === "Zubat").length > 0) return false;
    return true;
  }

  makeNoise() {
    let tileType = "";
    switch (this.tile.type) {
      case spaceTypes.WATER: {
        tileType = `Water`;
        break;
      }
      case spaceTypes.SAFE: {
        tileType = `Escaped`;
        break;
      }
      default: {
        let roll = Math.floor(Math.random() * 10);
        if (roll + this.timesStealthed > 7) {
          this.timesStealthed = -2;
          tileType = `${this.tile.label}`;
        } else {
          this.timesStealthed++;
          tileType = `Rocky`;
        }
        break;
      }
    }
    return tileType;
  }
}
