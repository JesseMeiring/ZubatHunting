import { Image } from "p5";
import { Shape } from "./shape";

export class Actor {
  tile: Shape;
  sprite: Image;
  visible: boolean;
  spritePath: String;

  constructor(startingTile: Shape, sprite: Image, spritePath: String) {
    this.tile = startingTile;
    this.tile.actors.push(this);
    this.sprite = sprite;
    this.visible = true;
    this.spritePath = spritePath;
  }

  move(tile: Shape) {
    //remove self from old tile contents
    const indexOfThis = this.tile.actors.indexOf(this);
    if (indexOfThis > -1) this.tile.actors.splice(indexOfThis, 1);

    //change this Trainers tile
    this.tile = tile;

    //Add self to tile contents
    this.tile.actors.push(this);
  }
}
