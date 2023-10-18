export class Actor {
    constructor(startingTile, sprite, spritePath) {
        this.tile = startingTile;
        this.tile.actors.push(this);
        this.sprite = sprite;
        this.visible = true;
        this.spritePath = spritePath;
    }
    move(tile) {
        //remove self from old tile contents
        const indexOfThis = this.tile.actors.indexOf(this);
        if (indexOfThis > -1)
            this.tile.actors.splice(indexOfThis, 1);
        //change this Trainers tile
        this.tile = tile;
        //Add self to tile contents
        this.tile.actors.push(this);
    }
}
