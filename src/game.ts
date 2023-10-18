/// <reference path="../typings/p5-global.d.ts" />
import type p5 from "p5";
import { Image } from "p5";

import { Shape } from "./shape";
import { Actor } from "./actor";
import { Net } from "./net";
import { Trainer } from "./trainer";

export class Game{
    width: number = 600;
    height: number = 500;
    shapeHeight: number = 48;
    trainerSprite: p5.Image;
    playerSprite: p5.Image;
    levelImage: p5.Image;
    // netObj: Net;
    // trainerObj: Trainer;

    constructor(){
        this.trainerSprite = new Image(0, 0);
        this.playerSprite = new Image(0, 0);
        this.levelImage = new Image(0, 0);
    }

    loadImages(p: p5){
        this.trainerSprite =
            p.loadImage('assets/TrainerSpriteSmall.png');
        this.playerSprite = 
            p.loadImage('assets/ZubatSprite.png');
        this.levelImage = 
            p.loadImage('assets/ZubatCaveLevel2.png');
    }
}