import type p5 from "p5";
import { Game } from "./game";
import { level1 } from "./level1";

export type p5x = p5 & {
  font: p5.Font;
  bg: p5.Color;
};

let gameController: Game;

export default function sketch(p: p5) {
  let tileNameButton = document.getElementById("tileNameButton");

  gameController = new Game(p, level1);

  p.preload = preload;
  p.setup = setup;
  p.draw = draw;
  p.mousePressed = mousePressed;
}

function preload(this: p5x) {
  gameController.loadImages(this);
}

function setup(this: p5x) {
  gameController.intializeCanvas(this);
}

function draw(this: p5x) {
  gameController.drw(this);
}

function mousePressed(this: p5x) {
  gameController.mapPressed(this);
}
