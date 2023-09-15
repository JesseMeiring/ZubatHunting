"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer = void 0;
var actor_1 = require("./actor");
var Trainer = /** @class */ (function (_super) {
    __extends(Trainer, _super);
    function Trainer(startingTile, sprite, spritePath) {
        var _this = _super.call(this, startingTile, sprite, spritePath) || this;
        _this.timesStealthed = 0;
        _this.progress = 0;
        return _this;
    }
    Object.defineProperty(Trainer.prototype, "takeTurn", {
        get: function () {
            var nextTile = this.determineNextMove;
            if (nextTile)
                this.move(nextTile);
            //make Noise
            return this.makeNoise();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Trainer.prototype, "determineNextMove", {
        get: function () {
            var closerTiles = [];
            var sameDistTiles = [];
            var backStepTiles = [];
            //place all tiles into the appropiate array based on thier distance to the end
            for (var _i = 0, _a = this.tile.neighbors; _i < _a.length; _i++) {
                var n = _a[_i];
                if (this.tile.distToSafe > n.distToSafe && n.type != 5)
                    closerTiles.push(n);
                if (this.tile.distToSafe == n.distToSafe && n.type != 5)
                    sameDistTiles.push(n);
                if (this.tile.distToSafe < n.distToSafe && n.type != 5)
                    backStepTiles.push(n);
            }
            var forwardPossible = closerTiles.length > 0;
            var strafePossible = sameDistTiles.length > 0;
            var backwardsPossible = backStepTiles.length > 0;
            //change this Trainers tile
            var roll = Math.floor(Math.random() * 10) - this.progress;
            var intent;
            if (roll > 0) {
                intent = "Forward";
            }
            else if (roll > -2) {
                intent = "Strafe";
            }
            else {
                intent = "Backward";
            }
            var direction;
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
            console.log("Trainer rolled a ".concat(roll + this.progress, ", minus progress of ").concat(this.progress, ", gives an intent of ").concat(intent, ", \n  the direction becomes ").concat(direction));
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
        },
        enumerable: false,
        configurable: true
    });
    Trainer.prototype.makeNoise = function () {
        var tileType = "";
        switch (this.tile.type) {
            case 0: {
                tileType = "Water";
                break;
            }
            case 2: {
                tileType = "Escaped";
                break;
            }
            default: {
                var roll = Math.floor(Math.random() * 10);
                //console.log(`roll ${roll}`)
                if (roll + this.timesStealthed > 7) {
                    this.timesStealthed = -2;
                    tileType = "".concat(this.tile.label);
                }
                else {
                    this.timesStealthed++;
                    tileType = "Rocky";
                }
                break;
            }
        }
        return tileType;
    };
    return Trainer;
}(actor_1.Actor));
exports.Trainer = Trainer;
