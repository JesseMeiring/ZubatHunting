/// <reference path="../typings/p5-global.d.ts" />
import type p5 from "p5";
import { Image, Renderer } from "p5";

import { Shape } from "./shape";
import { Actor } from "./actor";
import { Net } from "./net";
import { Trainer } from "./trainer";
import { DisplayData } from "./displayData";
import { spaceTypes } from "./spaceTypes";
import { p5x } from "./sketch";

export class Game {
  width: number = 600;
  height: number = 520;
  shapeHeight: number = 48;
  netObj: Net;
  trainerObj: Trainer;
  playerObj: Actor;
  displayData: DisplayData;
  gameover: boolean;
  turnCount: number;
  trainerMove: boolean = false;
  logText: string = `Log`;
  notificationMsg: string = `A trainer is in the cave. Make sure they don't escape without a fight!
    Click a tile to select it. Click again to move there
    After each move, the trainer moves. If they move onto a rocky space, 
    they may give away thier position
    If they move onto water, they will make a splashing noise but 
    it's hard to know which water tile they moved onto`;
  p5Instance: p5;
  canvas: p5.Renderer;
  verticalDisplay: boolean = false;
  parentElement: HTMLElement;

  constructor(p: p5, level: spaceTypes[][], parentElement: HTMLElement) {
    this.p5Instance = p;
    this.displayData = new DisplayData(false, false, false, 100);
    this.gameover = false;
    this.turnCount = 1;
    this.netObj = new Net(this.shapeHeight, level, new Image(1, 1));
    this.trainerObj = new Trainer(
      this.netObj.trainerSpawnSpace,
      new Image(1, 1),
      "assets/TrainerSpriteSmall.png"
    );
    this.playerObj = new Actor(
      this.netObj.playerSpawnSpace,
      new Image(1, 1),
      "assets/ZubatSprite.png",
      "Zubat"
    );
    this.canvas = new Renderer(parentElement, p, true);
    this.parentElement = parentElement;
  }

  loadImages(p: p5) {
    this.netObj.sprite = p.loadImage("assets/ZubatCaveLevel2.png");
    this.trainerObj.sprite = p.loadImage("assets/TrainerSpriteSmall.png");
    this.playerObj.sprite = p.loadImage("assets/ZubatSprite.png");
  }

  intializeCanvas(p: p5) {
    this.canvas = p.createCanvas(this.width, this.height);
    this.resizeToWindow(p);

    // Move the canvas so it’s inside our <div id="canvas">.
    this.canvas.parent("canvas");

    p.background(220);
  }

  resizeToWindow(p: p5){
    if(p.windowWidth > 600){
      this.width = 600;
      this.verticalDisplay = false;
    } else {
      this.width = this.netObj.sprite.width;
      this.verticalDisplay = true;
    }
    p.resizeCanvas(this.width, this.height);
  }

  drw(p: p5) {
    this.resizeToWindow(p);
    p.background(220);

    let logNote = "";
    if (this.trainerMove) logNote = this.trainerObj.takeTurn;
    if (logNote != "") {
      this.addToLog(logNote);
      this.trainerMove = false;
    }
    this.printLog();
    this.printNotification();
    this.netObj.drw(p, this.displayData);
  }

  mapPressed(p: p5) {
    if (!this.gameover) {
      let cellClicked = this.netObj.clickAt(p.mouseX, p.mouseY);
      if (cellClicked && cellClicked.type != 5) {
        if (cellClicked.selected) {
          if (this.netObj.withinTwoMovement(cellClicked, this.playerObj.tile)) {
            this.playerObj.move(cellClicked);
            if (this.playerObj.tile == this.trainerObj.tile) {
              this.gameEnd(true);
            } else {
              this.trainerMove = true;
            }
          } else {
            this.notificationMsg = `You can only move two spaces at a time. Sorry!`;
          }
          this.netObj.clearSelected();
        } else {
          this.netObj.clearSelected();
          cellClicked.selected = true;
          this.trainerMove = false;
        }
      }
    }
  }

  gameEnd(victory: boolean) {
    if (victory) this.addToLog("win");
    this.trainerObj.visible = true;
    this.trainerMove = false;
    this.gameover = true;
  }

  addToLog(message: string) {
    this.logText += `\nTurn ${this.turnCount}: ` + message;
    this.turnCount++;
    switch (message) {
      case "Water":
        this.notificationMsg = `You hear some noise in the water!`;
        break;
      case "Escaped":
        this.notificationMsg = `The trainer escaped! Game over 😢`;
        this.gameEnd(false);
        break;
      case "Rocky":
        this.notificationMsg = `They've moved onto a rocky space`;
        break;
      case "win":
        this.notificationMsg = `🎉 Victory! 🎉 But who has caught who?`;
        break;
      default:
        this.notificationMsg = `You hear a noise at ${message}!`;
        break;
    }
    let lines = this.logText.split("\n");
    if(lines.length > 8) lines.splice(1, 1);
    this.logText = lines.join("\n");
  }

  printLog() {
    this.p5Instance.noStroke();
    this.p5Instance.fill(0);
    if(this.verticalDisplay) {
      this.p5Instance.textSize(12);
      let NotifiationAndLog = this.logText + "\n" + this.notificationMsg;
      this.p5Instance.text(NotifiationAndLog, 15, 380);
    } else {
      this.p5Instance.textSize(15);
      this.p5Instance.text(this.logText, 425, 25);
    }
  }

  printNotification() {
    this.p5Instance.textSize(15);
    this.p5Instance.noStroke();
    this.p5Instance.fill(0);
    if(this.verticalDisplay){
      // this.p5Instance.textSize(12);
      // this.p5Instance.text(this.notificationMsg, 15, 380);
    } else {
      this.p5Instance.textSize(15);
      this.p5Instance.text(this.notificationMsg, 15, 380);
    }
  }

  showTileNames() {
    this.displayData.showLabels = !this.displayData.showLabels;
    // if(tileNameButton && displayData.showLabels) tileNameButton.innerText = "Hide Tile Names"
    // if(tileNameButton && !displayData.showLabels) tileNameButton.innerText = "Show Tile Names"
    this.trainerMove = false;
  }
}
