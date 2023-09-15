"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
var Actor = /** @class */ (function () {
    function Actor(startingTile, sprite, spritePath) {
        this.tile = startingTile;
        this.tile.actors.push(this);
        this.sprite = sprite;
        this.visible = true;
        this.spritePath = spritePath;
    }
    Actor.prototype.move = function (tile) {
        //remove self from old tile contents
        var indexOfThis = this.tile.actors.indexOf(this);
        if (indexOfThis > -1)
            this.tile.actors.splice(indexOfThis, 1);
        //change this Trainers tile
        this.tile = tile;
        //Add self to tile contents
        this.tile.actors.push(this);
    };
    return Actor;
}());
exports.Actor = Actor;
