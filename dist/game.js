import { Image } from "p5";
export class Game {
    // netObj: Net;
    // trainerObj: Trainer;
    constructor() {
        this.width = 600;
        this.height = 500;
        this.shapeHeight = 48;
        this.trainerSprite = new Image(0, 0);
        this.playerSprite = new Image(0, 0);
        this.levelImage = new Image(0, 0);
    }
    loadImages(p) {
        this.trainerSprite =
            p.loadImage('assets/TrainerSpriteSmall.png');
        this.playerSprite =
            p.loadImage('assets/ZubatSprite.png');
        this.levelImage =
            p.loadImage('assests/ZubatSaveLevel2');
    }
}
