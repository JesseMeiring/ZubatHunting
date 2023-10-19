import { Game } from "./game.js";
//Test
const BG = 0o100;
let gameController;
export default function sketch(p) {
    let netObj;
    let trainerObj;
    let trainerSprite;
    let trainerMove;
    let playerObj;
    let playerSprite;
    let gameover;
    let notificationMsg;
    let logText;
    let turnCount;
    let levelImage;
    let displayData;
    let tileNameButton = document.getElementById("tileNameButton");
    const W_SPACE = 0; //Water
    const N_SPACE = 1; //Noisy
    const spaceTypes.SAFE = 2; //Safe
    const T_SPACE = 3; //Trainer Start
    const spaceTypes.ZUBAT_SPAWN = 4; //Bat Start
    const E_SPACE = 5; //Empty
    const level1 = [
        [spaceTypes.SAFE, spaceTypes.ZUBAT_SPAWN, N_SPACE, N_SPACE, W_SPACE, W_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, E_SPACE, E_SPACE, N_SPACE, N_SPACE, N_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, E_SPACE, E_SPACE, N_SPACE],
        [W_SPACE, E_SPACE, W_SPACE, E_SPACE, W_SPACE, E_SPACE, E_SPACE, N_SPACE],
        [N_SPACE, E_SPACE, N_SPACE, E_SPACE, N_SPACE, N_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, W_SPACE, T_SPACE],
    ];
    gameController = new Game();
    p.preload = preload;
    p.setup = setup;
    p.draw = draw;
}
function preload() {
    gameController.loadImages(this);
    console.log("Preloading");
}
function setup() {
    this.createCanvas(750, 300);
    this.bg = this.color(BG);
}
function draw() {
    this.background(this.bg);
}
