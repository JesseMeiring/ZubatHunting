import type p5 from "p5";
import { Net } from './net';
import { Trainer } from './trainer';
import { Actor } from './actor';
import { DisplayData } from './displayData';
import { Game } from "./game";

export type p5x = p5 & { font: p5.Font, bg: p5.Color/*, vehicles: Vehicle[] */};
//Test
const
  BG = 0o100;
let gameController: Game;

export default function sketch(p: p5) {

  let netObj: Net
  let trainerObj: Trainer
  let trainerSprite: p5.Image
  let trainerMove: boolean
  let playerObj: Actor
  let playerSprite: p5.Image
  let gameover: boolean
  let notificationMsg: string
  let logText: string
  let turnCount: number
  let levelImage: p5.Image
  let displayData: DisplayData

  let tileNameButton = document.getElementById("tileNameButton")

  const W_SPACE = 0 //Water
  const N_SPACE = 1 //Noisy
  const S_SPACE = 2 //Safe
  const T_SPACE = 3 //Trainer Start
  const B_SPACE = 4 //Bat Start
  const E_SPACE = 5 //Empty

  const level1 = [
    [S_SPACE,   B_SPACE,   N_SPACE,   N_SPACE,   W_SPACE,   W_SPACE,   W_SPACE,   N_SPACE],
    [N_SPACE,   E_SPACE,   E_SPACE,   N_SPACE,   N_SPACE,   N_SPACE,   W_SPACE,   N_SPACE],
    [N_SPACE,   N_SPACE,   N_SPACE,   N_SPACE,   N_SPACE,   E_SPACE,   E_SPACE,   N_SPACE],
    [W_SPACE,   E_SPACE,   W_SPACE,   E_SPACE,   W_SPACE,   E_SPACE,   E_SPACE,   N_SPACE],
    [N_SPACE,   E_SPACE,   N_SPACE,   E_SPACE,   N_SPACE,   N_SPACE,   W_SPACE,   N_SPACE],
    [N_SPACE,   N_SPACE,   N_SPACE,   N_SPACE,   N_SPACE,   N_SPACE,   W_SPACE,   T_SPACE],
  ]

  gameController = new Game();

  p.preload = preload;
  p.setup = setup;
  p.draw = draw;
}

function preload(this: p5x) {
  gameController.loadImages(this);  
  console.log("Preloading");
}

function setup(this: p5x) {
  this.createCanvas(750, 300);

  this.bg = this.color(BG);
}

function draw(this: p5x) {
  this.background(this.bg);
}