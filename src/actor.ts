import { Image } from "p5";
import { Space } from "./space";

export class Actor {
  tile: Space;
  sprite: Image;
  visible: boolean;
  spritePath: String;
  type: string;

  constructor(
    startingTile: Space,
    sprite: Image,
    spritePath: String,
    type: string
  ) {
    this.tile = startingTile;
    this.tile.actors.push(this);
    this.sprite = sprite;
    this.visible = true;
    this.spritePath = spritePath;
    this.type = type;
  }

  move(tile: Space) {
    //remove self from old tile contents
    const indexOfThis = this.tile.actors.indexOf(this);
    if (indexOfThis > -1) this.tile.actors.splice(indexOfThis, 1);

    //change this Trainers tile
    this.tile = tile;

    //Add self to tile contents
    this.tile.actors.push(this);
  }
}
